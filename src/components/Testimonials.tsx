"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const reviews = [
    {
      name: "Budi Santoso",
      text: "Barbershop terbaik di Cimahi! Rizky bener-bener ahli dalam urusan fade. Tempatnya nyaman dan pelayanannya premium banget.",
      role: "Pelanggan Tetap",
      stars: 5
    },
    {
      name: "Andi Wijaya",
      text: "Gak pernah kecewa potong di sini. Timnya ramah, alat-alatnya bersih. Paket Father & Son-nya juara, anak saya betah banget.",
      role: "Wiraswasta",
      stars: 5
    },
    {
      name: "Kevin Pratama",
      text: "Harganya worth it banget sama hasilnya. Styling-nya dapet, dapet tips perawatan rambut juga. Sangat direkomendasikan!",
      role: "Mahasiswa",
      stars: 5
    }
  ];

  return (
    <section className="py-24 bg-black overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold uppercase tracking-widest mb-4">Testimoni</h2>
          <h3 className="text-4xl md:text-5xl font-black text-white">Apa Kata Mereka?</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-secondary-light p-8 rounded-2xl relative"
            >
              <Quote className="absolute top-6 right-6 text-primary/20" size={48} />
              <div className="flex gap-1 mb-4">
                {[...Array(review.stars)].map((_, i) => (
                  <Star key={i} size={16} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-white/80 italic mb-8 leading-relaxed">
                "{review.text}"
              </p>
              <div>
                <h4 className="text-white font-bold">{review.name}</h4>
                <p className="text-primary/70 text-sm uppercase tracking-tighter">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
