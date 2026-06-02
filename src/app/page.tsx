import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import BookingFlow from "@/components/booking/BookingFlow";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

// Main page component
export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Gallery />
      <BookingFlow />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
