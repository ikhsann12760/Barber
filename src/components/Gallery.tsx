"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

const Gallery = () => {
  const items = [
    {
      type: "video",
      url: "https://i.ibb.co.com/5hrv4bbj/images.jpg",
      videoUrl: "https://i.ibb.co.com/5hrv4bbj/images.jpg",
      title: "Low Fade Haircut"
    },
    {
      type: "video",
      url: "https://i.ibb.co.com/6J724162/images.jpg",
      videoUrl: "https://i.ibb.co.com/6J724162/images.jpg",
      title: "Comma Haircut"
    },
    {
      type: "video",
      url: "https://i.ibb.co.com/LdBVsvJ2/images.jpg",
      videoUrl: "https://i.ibb.co.com/LdBVsvJ2/images.jpg",
      title: "Tapper HairFade Cut"
    },
    {
      type: "video",
      url: "https://i.ibb.co.com/bjPZdJzZ/model-rambut-pria-curtain-haircut.jpg",
      videoUrl: "https://i.ibb.co.com/bjPZdJzZ/model-rambut-pria-curtain-haircut.jpg",
      title: "Curtain Haicut"
    },
    {
      type: "video",
      url: "https://i.ibb.co.com/Z1J2DK3V/images.jpg",
      videoUrl: "https://i.ibb.co.com/Z1J2DK3V/images.jpg",
      title: "Wolf Haircut"
    },
    {
      type: "video",
      url: "https://i.ibb.co.com/zWG8QvLF/images.jpg",
      videoUrl: "https://i.ibb.co.com/zWG8QvLF/images.jpg",
      title: "mullet Haircut"
    }
  ];

  return (
    <section id="gallery" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-primary font-bold text-xs md:text-sm uppercase tracking-[0.3em] mb-3 md:mb-4">Galeri</h2>
          <h3 className="text-3xl md:text-5xl font-black text-white">Hasil Karya & Suasana</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="aspect-square rounded-lg overflow-hidden group cursor-pointer relative"
            >
              {item.type === "video" ? (
                <div className="w-full h-full relative">
                  <video 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="auto"
                    poster={item.url}
                  >
                    <source src={item.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {/* Simplified Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-sm font-bold truncate">{item.title}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full relative">
                  <img 
                    src={item.url} 
                    alt={`${item.title} - Galeri Mockup Website`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-sm font-bold truncate">{item.title}</p>
                  </div>
                </div>
              )}

              {/* Removed redundant Play button and Border */}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
