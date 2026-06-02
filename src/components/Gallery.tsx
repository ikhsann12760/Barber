"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

const Gallery = () => {
  const items = [
    {
      type: "video",
      url: "/img/img1.png",
      videoUrl: "/videos/video1.mp4",
      title: "Mid Taper Side Part"
    },
    {
      type: "video",
      url: "/img/img2.png",
      videoUrl: "/videos/video2.mp4",
      title: "Ngabuburit di Daddy's Cut"
    },
    {
      type: "video",
      url: "/img/img3.png",
      videoUrl: "/videos/video3.mp4",
      title: "Barber Skills"
    },
    {
      type: "video",
      url: "/img/image4.png",
      videoUrl: "/videos/video4.mp4",
      title: "comma haircut"
    },
    {
      type: "video",
      url: "/img/image5.png",
      videoUrl: "/videos/video5.mp4",
      title: "comma haircut"
    },
    {
      type: "video",
      url: "/img/image6.png",
      videoUrl: "/videos/video6.mp4",
      title: "mullet Haircut"
    }
  ];

  return (
    <section id="gallery" className="py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold uppercase tracking-widest mb-4">Galeri</h2>
          <h3 className="text-4xl md:text-5xl font-black text-white">Hasil Karya & Suasana</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
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
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none">
                    <div className="w-12 h-12 bg-primary/80 rounded-full flex items-center justify-center text-black opacity-100 group-hover:opacity-0 transition-opacity">
                      <Play fill="currentColor" size={24} className="ml-1" />
                    </div>
                  </div>
                </div>
              ) : (
                <img 
                  src={item.url} 
                  alt={`${item.title} - Gaya rambut terbaik dari Daddy'scut Barber`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              )}

              <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 transition-colors rounded-lg pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
