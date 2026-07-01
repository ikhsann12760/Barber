import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black py-12 border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-3 group">
              <img 
                src="/img/logo.png" 
                alt="Logo" 
                className="w-10 h-10 object-cover rounded-full border border-primary/20 group-hover:border-primary transition-colors"
              />
              <div className="flex flex-col">
                <div className="flex items-center tracking-tighter">
                  <span className="text-white font-black text-lg">MOCKUP</span>
                  <span className="text-primary font-black text-lg ml-1.5">WEBSITE</span>
                </div>
              </div>
            </Link>
            <p className="text-white/40 text-sm mt-6 max-w-xs leading-relaxed">
              Mockup website untuk menampilkan berbagai fitur dan layanan modern. Dibuat dengan desain yang responsif dan profesional.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-bold text-white/60">
            <Link href="#" className="hover:text-primary transition-colors">Beranda</Link>
            <Link href="#about" className="hover:text-primary transition-colors">Tentang</Link>
            <Link href="#services" className="hover:text-primary transition-colors">Layanan</Link>
            <Link href="#gallery" className="hover:text-primary transition-colors">Galeri</Link>
            <Link href="#contact" className="hover:text-primary transition-colors">Kontak</Link>
          </div>

          <div className="text-center md:text-right">
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()} Mockup Website. <br className="md:hidden" /> All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
