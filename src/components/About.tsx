"use client";

import { motion } from "framer-motion";
import { Scissors, ShieldCheck, Coffee, Users } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Scissors className="text-primary" size={32} />,
      title: "Barber Profesional",
      desc: "Tim ahli dengan pengalaman bertahun-tahun dalam berbagai gaya rambut."
    },
    {
      icon: <Coffee className="text-primary" size={32} />,
      title: "Barista Coffee",
      desc: "Nikmati kopi premium pilihan sambil menunggu giliran atau setelah cukur."
    },
    {
      icon: <ShieldCheck className="text-primary" size={32} />,
      title: "Higiene Terjamin",
      desc: "Peralatan selalu disterilkan sebelum dan sesudah digunakan."
    },
    {
      icon: <Users className="text-primary" size={32} />,
      title: "Semua Usia",
      desc: "Layanan ramah untuk anak-anak, remaja, hingga dewasa."
    }
  ];

  return (
    <section id="about" className="py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-primary font-bold uppercase tracking-widest mb-4">Tentang Kami</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              Lebih Dari Sekadar <br /> <span className="text-primary">Barbershop</span>
            </h3>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              Daddy's Cut Barber & Coffee hadir di Cimahi untuk memberikan pengalaman grooming yang berbeda. Kami percaya bahwa setiap pria berhak mendapatkan perawatan terbaik sambil menikmati secangkir kopi berkualitas dalam suasana yang santai dan maskulin.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {features.map((f, i) => (
                <div key={i} className="flex flex-col gap-3">
                  {f.icon}
                  <h4 className="text-white font-bold text-xl">{f.title}</h4>
                  <p className="text-white/60">{f.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl overflow-hidden border-2 border-primary/20">
              <img 
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop" 
                alt="Suasana interior barbershop modern Daddy'scut Barber & Coffee"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-primary p-8 rounded-lg hidden md:block">
              <p className="text-black font-black text-5xl">5+</p>
              <p className="text-black font-bold uppercase tracking-tighter">Tahun Pengalaman</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
