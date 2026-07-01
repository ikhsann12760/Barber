"use client";

import { motion } from "framer-motion";
import { Clock, MessageSquare } from "lucide-react";
import { useState } from "react";

const Booking = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    branch: "Cibabat (Pusat)",
    service: "Gentleman's Cut",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const waNumber = "6283816112959"; // Nomor WA Mockup Website
    const text = `Halo Mockup Website, saya ingin booking layanan:
    
Cabang: ${formData.branch}
Nama: ${formData.name}
WhatsApp: ${formData.phone}
Layanan: ${formData.service}
Catatan: ${formData.message || "-"}

Mohon konfirmasi slot waktunya. Terima kasih!`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${waNumber}?text=${encodedText}`, "_blank");
  };

  const schedule = [
    { day: "Senin", time: "09:00 - 21:00" },
    { day: "Selasa", time: "09:00 - 21:00" },
    { day: "Rabu", time: "09:00 - 21:00" },
    { day: "Kamis", time: "09:00 - 21:00" },
    { day: "Jumat", time: "09:00 - 21:00" },
    { day: "Sabtu", time: "09:00 - 21:00" },
    { day: "Minggu", time: "09:00 - 21:00" },
  ];

  return (
    <section id="booking" className="py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-black/50 p-8 md:p-12 rounded-3xl border border-white/10"
          >
            <h2 className="text-primary font-bold uppercase tracking-widest mb-4">Reservasi Online</h2>
            <h3 className="text-3xl md:text-4xl font-black text-white mb-8">Amankan Slot Anda</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-white/70 text-sm mb-2 font-medium">Pilih Cabang</label>
                  <select 
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                  >
                    <option className="bg-secondary">Cibabat </option>
                    <option className="bg-secondary">Pasirkaliki</option>
                    <option className="bg-secondary">Kolonel Matsuri</option>
                    <option className="bg-secondary">Cigugur</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/70 text-sm mb-2 font-medium">Nama Lengkap</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="Masukkan nama Anda"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2 font-medium">Nomor WhatsApp</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="Contoh: 08123456789"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-white/70 text-sm mb-2 font-medium">Pilih Layanan</label>
                  <select 
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                  >
                    <option className="bg-secondary">Hair Cuts</option>
                    <option className="bg-secondary">Full Service</option>
                    <option className="bg-secondary">Kids Haircut</option>
                    <option className="bg-secondary">Baby Hair Cuts</option>
                    <option className="bg-secondary">Package(Dad And Kids Hair Cuts)</option>
                  </select>
                </div>
              </div>
            
                <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-white/70 text-sm mb-2 font-medium">Layanan Lainnya</label>
                  <select 
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                  >
                    <option className="bg-secondary">None</option>
                    <option className="bg-secondary">Shaving</option>
                    <option className="bg-secondary">Head Massage & Wash</option>
                    <option className="bg-secondary">Creambath</option>
                    <option className="bg-secondary">Hair Coloruing</option>
                    <option className="bg-secondary">Hair Coloruing(Black)</option>
                    <option className="bg-secondary">Hair Coloruing(Bleaching)</option>
                    <option className="bg-secondary">Hair Coloruing(Full Fashion)</option>
                    <option className="bg-secondary">Perming</option>
                    <option className="bg-secondary">Down Perm</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2 font-medium">Pesan Tambahan</label>
                <textarea 
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="Catatan khusus..."
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-black font-black py-4 rounded-lg transition-all transform hover:scale-[1.02]"
              >
                KONFIRMASI BOOKING VIA WHATSAPP
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <div className="mb-12">
              <h3 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
                <Clock className="text-primary" />
                Jam Operasional
              </h3>
              <div className="space-y-4">
                {schedule.map((item, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="text-white font-medium">{item.day}</span>
                    <span className={item.day === "Jumat" ? "text-primary font-bold" : "text-white/60"}>
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-primary rounded-2xl text-black">
              <h4 className="text-2xl font-black mb-4 flex items-center gap-2">
                <MessageSquare />
                Konsultasi Gratis?
              </h4>
              <p className="font-medium mb-6">
                Belum yakin dengan gaya rambut yang cocok? Hubungi kami via WhatsApp untuk konsultasi langsung dengan barber kami.
              </p>
              <a 
                href="https://wa.me/6281234567890" 
                target="_blank" 
                className="inline-block bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-black transition-colors"
              >
                Chat Sekarang
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Booking;
