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
      name: "Daddy's Coffe Shops",
      price: "Got On Menu",
      desc: "Daddy's Cuts collection of drink menus with signature coffee.",
      image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=1937&auto=format&fit=crop"
    }
  ];

  return (
    <section id="services" className="py-24 bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold uppercase tracking-widest mb-4">Layanan Kami</h2>
          <h3 className="text-4xl md:text-5xl font-black text-white">Menu Grooming</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-secondary-light rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={service.image} 
                  alt={`${service.name} - Layanan cukur pria di Daddy'scut Barber`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-white text-xl font-bold">{service.name}</h4>
                  <span className="text-primary font-black">{service.price}</span>
                </div>
                <p className="text-white/60 mb-6">{service.desc}</p>
                <a 
                  href="#booking" 
                  className="text-primary font-bold text-sm uppercase tracking-tighter hover:text-white transition-colors"
                >
                  Booking Sekarang &rarr;
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
