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
    <section id="about" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-primary font-bold text-xs md:text-sm uppercase tracking-[0.3em] mb-3 md:mb-4">Tentang Kami</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
              Lebih Dari Sekadar <br /> <span className="text-primary">Barbershop</span>
            </h3>
            <p className="text-white/70 text-base md:text-lg mb-8 leading-relaxed">
              Daddy's Cut Barber & Coffee hadir di Cimahi untuk memberikan pengalaman grooming yang berbeda. Kami percaya bahwa setiap pria berhak mendapatkan perawatan terbaik sambil menikmati secangkir kopi berkualitas dalam suasana yang santai dan maskulin.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {features.map((f, i) => (
                <div key={i} className="flex flex-col gap-2 md:gap-3 p-4 md:p-0 rounded-xl bg-white/5 md:bg-transparent">
                  <div className="text-primary">{f.icon}</div>
                  <h4 className="text-white font-bold text-lg md:text-xl">{f.title}</h4>
                  <p className="text-white/60 text-sm md:text-base">{f.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative mt-8 md:mt-0"
          >
            <div className="aspect-[4/5] md:aspect-[4/5] rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop" 
                alt="Suasana interior barbershop modern Daddy'scut Barber & Coffee"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 bg-primary p-6 md:p-8 rounded-xl shadow-2xl">
              <p className="text-black font-black text-4xl md:text-5xl">5+</p>
              <p className="text-black font-bold uppercase tracking-tighter text-xs md:text-sm">Tahun Pengalaman</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
