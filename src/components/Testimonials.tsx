"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const reviews = [
    {
      name: "Budi Santoso",
      text: "Website terbaik! Desainnya modern dan responsif. Fitur booking online sangat membantu.",
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
    <section className="py-16 md:py-24 bg-black overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-primary font-bold text-xs md:text-sm uppercase tracking-[0.3em] mb-3 md:mb-4">Testimoni</h2>
          <h3 className="text-3xl md:text-5xl font-black text-white">Apa Kata Mereka?</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-secondary-light p-6 md:p-8 rounded-2xl relative border border-white/5"
            >
              <Quote className="absolute top-4 right-4 md:top-6 md:right-6 text-primary/10" size={40} />
              <div className="flex gap-1 mb-4">
                {[...Array(review.stars)].map((_, i) => (
                  <Star key={i} size={14} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-white/80 italic mb-6 md:mb-8 text-sm md:text-base leading-relaxed">
                "{review.text}"
              </p>
              <div>
                <h4 className="text-white font-bold text-sm md:text-base">{review.name}</h4>
                <p className="text-primary/70 text-[10px] md:text-sm uppercase tracking-wider">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
