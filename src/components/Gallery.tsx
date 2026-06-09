"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

const Gallery = () => {
  const items = [
    {
      type: "video",
      url: "/img/img1.png",
      videoUrl: "https://scontent-cgk2-2.cdninstagram.com/o1/v/t16/f2/m266/AQNYqd7PB5cEKKPNBOwkfEb-zi_hft070rFGHWwx6r_qJFAMZH0sm4u_PsplwJu-7m4PMz0yoPLj7pIClKDp0UUHO2UJW9jJ1Us.mp4?strext=1&_nc_cat=100&_nc_sid=8bf8fe&_nc_ht=scontent-cgk2-2.cdninstagram.com&_nc_ohc=WipJuV6jJF8Q7kNvwFMg7TH&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuMTA4MC5jb21wcmVzc2VkX3NvdXJjZSIsInhwdl9hc3NldF9pZCI6MTQ5ODM0MTk2MTUyNTU0OCwiYXNzZXRfYWdlX2RheXMiOjI5OSwidmlfdXNlY2FzZV9pZCI6MTAwOTksImR1cmF0aW9uX3MiOjQzLCJ1cmxnZW5fc291cmNlIjoid3d3In0%3D&ccb=17-1&_nc_gid=gcKC-Xvv6j8GwgZl1BHGqA&_nc_ss=7a22e&_nc_zt=28&oh=00_Af8ZL5iK140G6yH3ic820KSw38wyEdSYfL7AqXCESsQmhg&oe=6A2A0120",
      title: "Mid Taper Side Part"
    },
    {
      type: "video",
      url: "/img/img2.png",
      videoUrl: "https://scontent-cgk2-2.cdninstagram.com/o1/v/t16/f2/m266/AQN8HaMd1xDUcUHtdCYPwIsBgNLngdyMxv_E4uasm8Rwckm7dW2NrDWasMZDYhLwZFdHc04lbFsCYEGtBFfd9hjtHDKftg61xs0.mp4?strext=1&_nc_cat=105&_nc_sid=8bf8fe&_nc_ht=scontent-cgk2-2.cdninstagram.com&_nc_ohc=fEPY18lSlNIQ7kNvwHniWv7&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuMTA4MC5jb21wcmVzc2VkX3NvdXJjZSIsInhwdl9hc3NldF9pZCI6NTc2NTQ1MzY4NzU4MjMwLCJhc3NldF9hZ2VfZGF5cyI6Mjk5LCJ2aV91c2VjYXNlX2lkIjoxMDA5OSwiZHVyYXRpb25fcyI6NDEsInVybGdlbl9zb3VyY2UiOiJ3d3cifQ%3D%3D&ccb=17-1&_nc_gid=O1LxBWiJaBMT7zO_9GYHmg&_nc_ss=7a22e&_nc_zt=28&oh=00_Af87Cl-3t5sNrbrhPOpOo3M92wonxsTjga5K4kjIQeXvEg&oe=6A2A201F",
      title: "Side Part Haircut"
    },
    {
      type: "video",
      url: "/img/img3.png",
      videoUrl: "https://scontent-cgk1-1.cdninstagram.com/o1/v/t16/f2/m266/AQNmzxECu7Y6r3F45TUrZkqdSxxWmnClczS5WXJQhQ8OZUGBcSkkRXMk7ayKc2cijoBaM7Se4noyRF3pJ2-9H09olcZyXtjy30Q.mp4?strext=1&_nc_cat=109&_nc_sid=8bf8fe&_nc_ht=scontent-cgk1-1.cdninstagram.com&_nc_ohc=QZMhTa4lM-YQ7kNvwENiedO&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuMTA4MC5jb21wcmVzc2VkX3NvdXJjZSIsInhwdl9hc3NldF9pZCI6MTA5MTk3MjI2Mjg0MjAwNCwiYXNzZXRfYWdlX2RheXMiOjMzMiwidmlfdXNlY2FzZV9pZCI6MTAwOTksImR1cmF0aW9uX3MiOjM2LCJ1cmxnZW5fc291cmNlIjoid3d3In0%3D&ccb=17-1&_nc_gid=LBGH4st11UZh-WVLsAICKQ&_nc_ss=7a22e&_nc_zt=28&oh=00_Af8MGDiv0ciPBp5Uo72jTVdNNFNYWqYTICkO5mZvwaVKtQ&oe=6A2A16F7",
      title: "Comma HairFade Cut"
    },
    {
      type: "video",
      url: "/img/image4.png",
      videoUrl: "https://scontent-cgk2-1.cdninstagram.com/o1/v/t16/f2/m266/AQNnj3_8XbVsTUjHVKeVKCq7Q24GDeOmAk0UWNxIiJu-8jJKQNnmGPFtd7Pw9gnI-U411GkCjkIo3kG_LM87zQ8AqGRhUjPk6K0.mp4?strext=1&_nc_cat=106&_nc_sid=8bf8fe&_nc_ht=scontent-cgk2-1.cdninstagram.com&_nc_ohc=DW7T0ywlJhkQ7kNvwHGRM7V&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuMTA4MC5jb21wcmVzc2VkX3NvdXJjZSIsInhwdl9hc3NldF9pZCI6MTI1NTgwMjM3OTYxMDExNCwiYXNzZXRfYWdlX2RheXMiOjI5NywidmlfdXNlY2FzZV9pZCI6MTAwOTksImR1cmF0aW9uX3MiOjQ3LCJ1cmxnZW5fc291cmNlIjoid3d3In0%3D&ccb=17-1&_nc_gid=gcKC-Xvv6j8GwgZl1BHGqA&_nc_ss=7a22e&_nc_zt=28&oh=00_Af9yGD7chDQU-wPuzhGQqwlPHmUfj2BCRYcHbrv4iyD4Wg&oe=6A29EFB6",
      title: "comma haircut"
    },
    {
      type: "video",
      url: "/img/image5.png",
      videoUrl: "https://scontent-cgk1-1.cdninstagram.com/o1/v/t16/f2/m266/AQMsXEq7V-aEBuqkciEKQlkWQxRnK_HLiAkfpmm9TiZBQKREE4-ivalhYP7HWcIE1TqWJg80PgeCkYR5AIkU2XQudrWPVm3vMTs.mp4?strext=1&_nc_cat=109&_nc_sid=8bf8fe&_nc_ht=scontent-cgk1-1.cdninstagram.com&_nc_ohc=oudOlq13kXQQ7kNvwE9P2fX&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuMTA4MC5jb21wcmVzc2VkX3NvdXJjZSIsInhwdl9hc3NldF9pZCI6MTE2NzYwNzA5ODgxMTY0NywiYXNzZXRfYWdlX2RheXMiOjE4NSwidmlfdXNlY2FzZV9pZCI6MTAwOTksImR1cmF0aW9uX3MiOjMxLCJ1cmxnZW5fc291cmNlIjoid3d3In0%3D&ccb=17-1&_nc_gid=OxTmdnQuT1J7t6AuiCIuNw&_nc_ss=7a22e&_nc_zt=28&oh=00_Af8_5lwwgEdZujLHZe4-5M8B_Yrn7Ii-3r3VUWwbU7peLw&oe=6A2A083F",
      title: "Kids Haircut"
    },
    {
      type: "video",
      url: "/img/image6.png",
      videoUrl: "https://scontent-cgk2-2.cdninstagram.com/o1/v/t16/f2/m266/AQMGo4oSohxcSVDyTUT_HiNze2pM7UvZfNuEzo8r0Eb37pcRqmYTPfNqRIkrnYiHZZ1loBFu11GzSjbgu2EH7T_LoK1m5gzMBPQ.mp4?strext=1&_nc_cat=105&_nc_sid=8bf8fe&_nc_ht=scontent-cgk2-2.cdninstagram.com&_nc_ohc=Qu2mUq8O0o4Q7kNvwGfGGuK&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuMTA4MC5jb21wcmVzc2VkX3NvdXJjZSIsInhwdl9hc3NldF9pZCI6MjE2MzkzMTc2NzM2Nzk3MywiYXNzZXRfYWdlX2RheXMiOjMyNSwidmlfdXNlY2FzZV9pZCI6MTAwOTksImR1cmF0aW9uX3MiOjQ3LCJ1cmxnZW5fc291cmNlIjoid3d3In0%3D&ccb=17-1&_nc_gid=LBGH4st11UZh-WVLsAICKQ&_nc_ss=7a22e&_nc_zt=28&oh=00_Af-ouo9ryCHCibRJsPNtpJMlAFSKZPeWNdwNkWNcboViYg&oe=6A2A17AF",
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
                    alt={`${item.title} - Gaya rambut terbaik dari Daddy'scut Barber`}
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
