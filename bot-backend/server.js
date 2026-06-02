import express from 'express';
import cors from 'cors';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
const prisma = new PrismaClient();
const PORT = process.env.BOT_PORT || 3001;

app.use(express.json());

// Ensure receipts directory exists
const receiptsDir = path.join(__dirname, 'receipts');
if (!fs.existsSync(receiptsDir)) {
    fs.mkdirSync(receiptsDir, { recursive: true });
}

// Serve receipts statically for admin dashboard
app.use('/receipts', express.static(receiptsDir));

const SYSTEM_PROMPT = `
Role: Anda adalah "AeroBot", asisten kasir otomatis yang ramah untuk toko kami (Daddy's Cut Barber & Coffee). Tugas utama Anda adalah melayani pembelian, menghitung total biaya, dan memberikan QRIS pembayaran. 
Workflow: 
- Ketahui apa yang dibeli, sebutkan total harga. 
- Jika pelanggan setuju, berikan instruksi scan QRIS dan WAJIB akhiri kalimat Anda dengan tag: [KIRIM_QRIS] 
- Ingatkan mereka untuk mengirimkan screenshot bukti transfer setelahnya.
`;

// Helper: Send WhatsApp Message
async function sendWAMessage(to, text) {
    try {
        await axios.post(process.env.WA_API_URL, {
            to,
            text
        }, {
            headers: { 'Authorization': `Bearer ${process.env.WA_TOKEN}` }
        });
    } catch (err) {
        console.error("WA Send Error:", err.response?.data || err.message);
    }
}

// Helper: Send WA Image (QRIS or any image)
async function sendWAImage(to, imageUrl, caption) {
    try {
        await axios.post(process.env.WA_API_URL + '/image', {
            to,
            imageUrl,
            caption
        }, {
            headers: { 'Authorization': `Bearer ${process.env.WA_TOKEN}` }
        });
    } catch (err) {
        console.error("WA Image Error:", err.response?.data || err.message);
    }
}

// API for Admin Dashboard
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await prisma.botOrder.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                service: true,
                branch: true,
                barber: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/orders/:id/approve', async (req, res) => {
    const { id } = req.params;
    try {
        const order = await prisma.botOrder.update({
            where: { id },
            data: { status: 'approved' }
        });
        
        await sendWAMessage(order.waNumber, "Pembayaran Anda sukses dikonfirmasi! Pesanan akan segera diproses.");
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/orders/:id/reject', async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
    try {
        const order = await prisma.botOrder.update({
            where: { id },
            data: { 
                status: 'rejected',
                rejectionReason: reason
            }
        });
        
        await sendWAMessage(order.waNumber, `Maaf, bukti transfer Anda tidak valid. ${reason}. Silakan kirim ulang.`);
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Webhook for WhatsApp
app.post('/webhook/whatsapp', async (req, res) => {
    const { from, text, type, imageUrl } = req.body;

    try {
        let conv = await prisma.conversation.findUnique({ where: { waNumber: from } });
        if (!conv) {
            conv = await prisma.conversation.create({ data: { waNumber: from, history: [] } });
        }

        if (type === 'text') {
            const history = Array.isArray(conv.history) ? conv.history : [];
            
            // LLM Integration
            const llmRes = await axios.post(process.env.LLM_ENDPOINT || 'https://api.openai.com/v1/chat/completions', {
                model: process.env.LLM_MODEL || "gpt-4",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    ...history,
                    { role: "user", content: text }
                ]
            }, {
                headers: { 'Authorization': `Bearer ${process.env.LLM_API_KEY}` }
            });

            let replyText = llmRes.data.choices[0].message.content;
            const shouldSendQRIS = replyText.includes('[KIRIM_QRIS]');
            
            if (shouldSendQRIS) {
                replyText = replyText.replace('[KIRIM_QRIS]', '').trim();
                await sendWAMessage(from, replyText);
                await prisma.conversation.update({
                    where: { waNumber: from },
                    data: { state: 'waiting_for_payment' }
                });
                // Send QRIS
                await sendWAImage(from, process.env.QRIS_IMAGE_URL, "Silakan scan QRIS ini untuk pembayaran.");
            } else {
                await sendWAMessage(from, replyText);
            }

            // Update History
            const updatedHistory = [...history, { role: "user", content: text }, { role: "assistant", content: replyText }];
            await prisma.conversation.update({
                where: { waNumber: from },
                data: { history: updatedHistory.slice(-20) } // Direct object for PostgreSQL Json
            });

        } 
        else if (type === 'image' && conv.state === 'waiting_for_payment') {
            const fileName = `receipt_${from}_${Date.now()}.jpg`;
            const filePath = path.join(receiptsDir, fileName);
            
            const response = await axios({ url: imageUrl, responseType: 'stream' });
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            // Try to extract price from history (very simple logic, can be improved)
            const history = Array.isArray(conv.history) ? conv.history : [];
            let lastPrice = 0;
            // Simplified: look for numbers in the last assistant message
            const lastAssistantMsg = [...history].reverse().find(m => m.role === 'assistant');
            if (lastAssistantMsg) {
                const priceMatch = lastAssistantMsg.content.match(/(\d+[\d.,]*)/);
                if (priceMatch) lastPrice = parseFloat(priceMatch[0].replace(/[,.]/g, ''));
            }

            await prisma.botOrder.create({
                data: {
                    waNumber: from,
                    totalPrice: lastPrice,
                    receiptUrl: `/receipts/${fileName}`,
                    status: 'pending'
                }
            });

            await prisma.conversation.update({
                where: { waNumber: from },
                data: { state: 'idle' }
            });

            await sendWAMessage(from, "Terima kasih, bukti transfer Anda telah diterima dan sedang diperiksa oleh admin!");
        }

        res.sendStatus(200);
    } catch (err) {
        console.error("Webhook Error:", err.message);
        if (!res.headersSent) {
            res.status(500).send(err.message);
        }
    }
});

app.listen(PORT, () => {
    console.log(`Bot Backend running on port ${PORT}`);
    console.log(`Receipts directory: ${receiptsDir}`);
});
