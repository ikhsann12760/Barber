import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black py-12 border-t border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <Link href="/" className="text-2xl font-bold tracking-tighter flex items-center gap-3">
              <img 
                src="/img/logo.png" 
                alt="Daddy's Cut Logo" 
                className="w-10 h-10 object-cover rounded-full border border-primary/20"
              />
              <div>
                <span className="text-white">DADDY'S</span>
                <span className="text-primary ml-2">CUT</span>
                <span className="text-white/40 text-xs ml-1">& COFFEE</span>
              </div>
            </Link>
            <p className="text-white/40 text-sm mt-4 max-w-xs">
              The premium grooming and coffee experience in Cimahi. Sejak 2019, kami konsisten memberikan kualitas terbaik untuk penampilan dan cita rasa kopi Anda.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-white/60">
            <Link href="#" className="hover:text-primary transition-colors">Beranda</Link>
            <Link href="#about" className="hover:text-primary transition-colors">Tentang</Link>
            <Link href="#services" className="hover:text-primary transition-colors">Layanan</Link>
            <Link href="#gallery" className="hover:text-primary transition-colors">Galeri</Link>
            <Link href="#booking" className="hover:text-primary transition-colors">Booking</Link>
          </div>

          <div className="text-center md:text-right">
            <p className="text-white/40 text-xs">
              © {new Date().getFullYear()} Daddy's Cut Barber. <br className="md:hidden" /> All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
