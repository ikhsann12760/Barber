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
    <section id="contact" className="py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-primary font-bold uppercase tracking-widest mb-4">Kontak Kami</h2>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-8">Kunjungi Kami</h3>
            
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="text-black" />
                </div>
                <div>
                  <h4 className="text-white text-xl font-bold mb-2">Lokasi</h4>
                  <p className="text-white/60">
                    Jl. Jati Serut No. 52, Cibabat, Kec. Cimahi Utara, <br />
                    Kota Cimahi, Jawa Barat 40513
                    Jl. Gn. Batu No.183, Pasirkaliki, Kec. Cimahi Utara, Kota Cimahi, Jawa Barat 40514
                    Jl. Jend. H. Amir Machmud No.281, Cigugur Tengah, Kec. Cimahi Tengah, Kota Cimahi, Jawa Barat 40522
                    Jl. Kolonel Masturi No.51, Cimahi, Kec. Cimahi Tengah, Kota Cimahi, Jawa Barat 40525
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <Phone className="text-black" />
                </div>
                <div>
                  <h4 className="text-white text-xl font-bold mb-2">Telepon / WA</h4>
                  <p className="text-white/60">+62 812-3456-7890</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <Mail className="text-black" />
                </div>
                <div>
                  <h4 className="text-white text-xl font-bold mb-2">Email</h4>
                  <p className="text-white/60">hello@daddyscut.com</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h4 className="text-white font-bold mb-6">Ikuti Kami</h4>
              <div className="flex gap-4">
                {[
                  { Icon: InstagramIcon, href: "https://www.instagram.com/daddyscut.barberncoffee/" },
                  { Icon: FacebookIcon, href: "https://web.facebook.com/profile.php?id=100082998777219" }
                ].map((item, i) => (
                  <a 
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary hover:text-black hover:border-primary transition-all"
                  >
                    <item.Icon />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="h-[450px] rounded-3xl overflow-hidden border border-white/10"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.050516644498!2d107.5457223!3d-6.8845423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e469503463a5%3A0x6a00a0a0a0a0a0a0!2sJl.%20Jati%20Serut%20No.52%2C%20Cibabat%2C%20Kec.%20Cimahi%20Utara%2C%20Kota%20Cimahi%2C%20Jawa%20Barat%2040513!5e0!3m2!1sid!2sid!4v1717220000000!5m2!1sid!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
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
