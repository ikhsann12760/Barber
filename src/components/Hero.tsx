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
          <h2 className="text-primary font-bold tracking-[0.3em] text-xs uppercase mb-6 opacity-80">Mockup Website</h2>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-tight">
            Elevate Your <br /> <span className="text-primary">Style & Taste</span>
          </h1>
          <p className="text-base md:text-xl text-white/60 max-w-xl mx-auto mb-10 md:mb-12 font-medium leading-relaxed">
            Nikmati layanan grooming terbaik dan kopi pilihan dalam satu tempat yang eksklusif di Cimahi.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-sm mx-auto sm:max-w-none">
            <a
              href="#booking-v2"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-primary hover:bg-white text-black px-8 md:px-10 py-4 rounded-xl font-black text-xs md:text-sm transition-all shadow-xl shadow-primary/20"
            >
              <Calendar size={18} />
              <span>BOOKING SEKARANG</span>
            </a>
            <a
              href="#services"
              className="w-full sm:w-auto bg-white/5 border border-white/10 hover:bg-white/10 text-white px-8 md:px-10 py-4 rounded-xl font-black text-xs md:text-sm transition-all"
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
