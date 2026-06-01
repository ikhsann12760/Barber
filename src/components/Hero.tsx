"use client";

import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Placeholder */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop")',
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-primary font-bold tracking-[0.2em] uppercase mb-4">The Premium Barber & Coffee Experience in Cimahi</h2>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter">
            DADDY'S <span className="text-primary">CUT</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 font-light">
            Grooming Maksimal, Kopi Berkualitas. Nikmati Pengalaman Cukur yang Tak Terlupakan dengan Sentuhan Barista.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#booking"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-black px-8 py-4 rounded-md font-bold text-lg transition-all transform hover:scale-105"
            >
              <Calendar size={20} />
              <span>BOOKING SEKARANG</span>
            </a>
            <a
              href="#services"
              className="w-full sm:w-auto bg-transparent border-2 border-white/30 hover:border-primary hover:text-primary text-white px-8 py-4 rounded-md font-bold text-lg transition-all"
            >
              LIHAT LAYANAN
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-1 h-12 rounded-full bg-white/20 relative">
          <div className="w-full h-4 bg-primary rounded-full absolute top-0" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
