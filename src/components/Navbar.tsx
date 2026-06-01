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
          <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-3">
            <img 
              src="/img/logo.png" 
              alt="Daddy's Cut Logo" 
              className="w-12 h-12 object-cover rounded-full border border-primary/20"
            />
            <div className="flex flex-col sm:flex-row sm:items-center">
              <span className="text-white">DADDY'S</span>
              <span className="text-primary sm:ml-2">CUT</span>
              <span className="text-white/40 text-[10px] sm:text-xs sm:ml-2 self-start sm:self-end mb-1">& COFFEE</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-black px-5 py-2 rounded-full font-bold transition-all transform hover:scale-105"
            >
              <Phone size={18} />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black border-t border-white/10 py-6 px-4 flex flex-col space-y-4 animate-in fade-in slide-in-from-top-5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-white/80 hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-primary text-black px-5 py-3 rounded-full font-bold"
            >
              <Phone size={18} />
              <span>WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
