"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "#" },
    { name: "Tentang", href: "#about" },
    { name: "Layanan", href: "#services" },
    { name: "Galeri", href: "#gallery" },
    { name: "Kontak", href: "#contact" },
  ];

  return (
    <nav
      className={cn(
        "fixed w-full z-50 transition-all duration-300",
        scrolled ? "bg-black/90 backdrop-blur-md py-4 shadow-lg" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src="https://i.ibb.co.com/mC3hSwB1/image1.webp" 
                alt="Logo" 
                className="w-10 h-10 md:w-12 md:h-12 object-cover rounded-full border border-primary/20 group-hover:border-primary transition-colors"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center tracking-tighter">
                <span className="text-white font-black text-lg md:text-xl">MOCKUP</span>
                <span className="text-primary font-black text-lg md:text-xl ml-1.5">WEBSITE</span>
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-bold text-white/90 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary hover:bg-white text-black px-6 py-2.5 rounded-full font-black text-sm transition-all shadow-lg shadow-primary/20"
            >
              <Phone size={16} fill="currentColor" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden fixed inset-x-0 top-[72px] bg-black/95 backdrop-blur-xl border-b border-white/10 py-8 px-6 flex flex-col space-y-6 animate-in fade-in slide-in-from-top-5 z-50 h-screen overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-2xl font-black text-white/90 hover:text-primary border-b border-white/5 pb-4"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-primary text-black px-6 py-4 rounded-xl font-black text-lg shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                <Phone size={24} />
                <span>HUBUNGI KAMI</span>
              </a>
              <p className="text-center text-white/40 text-xs mt-6">
                Buka setiap hari: 09:00 - 21:00
              </p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
