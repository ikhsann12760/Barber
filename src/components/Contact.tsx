"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2 58.38 58.38 0 0 1 15 0 2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2 58.38 58.38 0 0 1-15 0 2 2 0 0 1-2-2z" />
    <polyline points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
);

const Contact = () => {
  return (
    <section id="contact" className="py-16 md:py-32 bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-primary font-bold text-xs md:text-sm uppercase tracking-[0.4em] mb-4">KONTAK KAMI</h2>
            <h3 className="text-4xl md:text-7xl font-black text-white mb-12">Kunjungi Kami</h3>
            
            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={24} className="text-black" />
                </div>
                <div>
                  <h4 className="text-white text-xl font-bold mb-2">Lokasi</h4>
                  <p className="text-white/60 text-sm leading-relaxed max-w-md">
                    [Alamat akan diisi]
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <Phone size={24} className="text-black" />
                </div>
                <div>
                  <h4 className="text-white text-xl font-bold mb-1">Telepon / WA</h4>
                  <p className="text-white/60 text-sm">[Nomor Telepon]</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <Mail size={24} className="text-black" />
                </div>
                <div>
                  <h4 className="text-white text-xl font-bold mb-1">Email</h4>
                  <p className="text-white/60 text-sm">hello@mockupwebsite.com</p>
                </div>
              </div>
            </div>

            <div className="mt-16">
              <h4 className="text-white font-bold mb-6 text-sm">Ikuti Kami</h4>
              <div className="flex gap-4">
                {[
                  { icon: InstagramIcon, href: "#" },
                  { icon: FacebookIcon, href: "#" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center text-white hover:text-primary hover:border-primary transition-all bg-white/5"
                  >
                    <social.icon />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden border border-white/10"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d0!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sid!2sid!4v0!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
