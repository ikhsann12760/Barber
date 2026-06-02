const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkOrders() {
  try {
    const orders = await prisma.botOrder.findMany();
    console.log(`Total pesanan di BotOrder: ${orders.length}`);
    if (orders.length > 0) {
      console.log(JSON.stringify(orders, null, 2));
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkOrders();
