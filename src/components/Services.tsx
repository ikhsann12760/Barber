"use client";

import { motion } from "framer-motion";

const Services = () => {
  const services = [
    {
      name: "Gentleman's Hair Cuts",
      price: "Rp 50.000",
      desc: "Hair Cut, Shaving, Hair Styling.",
      image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1888&auto=format&fit=crop"
    },
    {
      name: "Full Service Cuts",
      price: "Rp 55.000",
      desc: "Hair Cut, Shaving, Warm Water Hair Wash, Hot Towel, Hiar Tonic, Head Massage, Styling Pomade, Back Massage.",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070&auto=format&fit=crop"
    },
    {
      name: "Baby Hair Cuts",
      price: "Rp 55.000",
      desc: "Baby Hair Cuts.",
      image: "/img/Image7.png"
    },
    {
      name: "Kids Haircut",
      price: "Rp 50.000",
      desc: "Kids Haircut, Warm Water Hair Wash, Styling.",
      image: "/img/img8.png"
    },
    {
      name: "Package(Dad And Kids Hair Cuts)",
      price: "Rp 100.000",
      desc: "Dad & Kids Hair Cuts Full Services",
      image: "/img/img5.png"
    },
    {
      name: "Coffee & Beverages",
      price: "Got On Menu",
      desc: "Collection of drink menus with signature coffee.",
      image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1937&auto=format&fit=crop"
    }
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-primary font-bold text-xs md:text-sm uppercase tracking-[0.3em] mb-3 md:mb-4">Layanan Kami</h2>
          <h3 className="text-3xl md:text-5xl font-black text-white">Menu Grooming</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group bg-secondary-light/50 rounded-2xl overflow-hidden border border-white/5 hover:border-primary/20 transition-all duration-300"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img 
                  src={service.image} 
                  alt={`${service.name} - Layanan Mockup Website`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-5 md:p-8">
                <div className="flex flex-col gap-1 mb-4">
                  <h4 className="text-white text-lg md:text-xl font-bold">{service.name}</h4>
                  <span className="text-primary font-black text-base">{service.price}</span>
                </div>
                <p className="text-white/50 text-xs md:text-sm mb-6 leading-relaxed line-clamp-2 md:line-clamp-none">{service.desc}</p>
                <a 
                  href="#booking-v2" 
                  className="inline-flex items-center gap-2 text-primary font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] hover:text-white transition-colors"
                >
                  Booking Sekarang <span className="text-lg">&rarr;</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
