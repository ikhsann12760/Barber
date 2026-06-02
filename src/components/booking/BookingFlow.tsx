"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, MapPin, Scissors, Calendar as CalendarIcon, Loader2, CreditCard, QrCode, X, Clock, Coffee, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveBookingToDb, createMidtransSnapToken } from "@/actions/booking";

declare global {
  interface Window {
    snap: any;
  }
}

const steps = [
  { id: 1, name: "Cabang", icon: MapPin },
  { id: 2, name: "Layanan", icon: Scissors },
  { id: 3, name: "Jadwal", icon: CalendarIcon },
  { id: 4, name: "Data Diri", icon: Check },
];

const branches = [
  { 
    id: "cibabat", 
    name: "Cibabat (Pusat)", 
    address: "Jl. Jati Serut No. 52, Cibabat, Kec. Cimahi Utara" 
  },
  { 
    id: "cihanjuang", 
    name: "Cihanjuang", 
    address: "Jl. Gn. Batu No.183, Pasirkaliki, Kec. Cimahi Utara" 
  },
  { 
    id: "sangkurian", 
    name: "Sangkurian", 
    address: "Jl. Jend. H. Amir Machmud No.281, Cigugur Tengah" 
  },
  { 
    id: "kolonel-masturi", 
    name: "Kolonel Masturi", 
    address: "Jl. Kolonel Masturi No.51, Cimahi Tengah" 
  }
];

const groomingServices = [
  { id: "g1", name: "Gentleman's Hair Cuts", price: 50000, duration: "45 min" },
  { id: "g2", name: "Full Service Cuts", price: 55000, duration: "60 min" },
  { id: "g3", name: "Baby Hair Cuts", price: 55000, duration: "30 min" },
  { id: "g4", name: "Kids Haircut", price: 50000, duration: "45 min" },
  { id: "g5", name: "Package (Dad & Kids)", price: 100000, duration: "90 min" },
];

const treatmentServices = [
  { id: "o1", name: "Shaving", price: 20000, duration: "20 min" },
  { id: "o2", name: "Head Massage & Wash", price: 25000, duration: "25 min" },
  { id: "o3", name: "Extra Massage", price: 15000, duration: "15 min" },
  { id: "o4", name: "Creambath", price: 75000, duration: "45 min" },
  { id: "o5", name: "Hair Colouring (Black)", price: 80000, duration: "60 min" },
  { id: "o6", name: "Hair Colouring (Bleaching)", price: 100000, duration: "60 min" },
  { id: "o7", name: "Hair Colouring (Full Fashion)", price: 250000, duration: "90 min" },
  { id: "o8", name: "Perming", price: 250000, duration: "120 min" },
  { id: "o9", name: "Down Perm", price: 150000, duration: "60 min" },
];

const coffeeServices = [
  { id: "c1", name: "Signature Coffee", price: 25000, duration: "As ordered" },
  { id: "c2", name: "Americano", price: 20000, duration: "As ordered" },
  { id: "c3", name: "Cafe Latte", price: 25000, duration: "As ordered" },
  { id: "c4", name: "Manual Brew", price: 28000, duration: "As ordered" },
];

export default function BookingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<"grooming" | "coffee">("grooming");
  
  const [selectedGrooming, setSelectedGrooming] = useState<string | null>(null);
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [selectedCoffee, setSelectedCoffee] = useState<string[]>([]);

  useEffect(() => {
    // Load Midtrans Snap script
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js"; // Use app.midtrans.com for production
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "Mid-client-Qi-PlDNBve8F5XUG";
    
    let script = document.createElement("script");
    script.src = midtransScriptUrl;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const [bookingData, setFormData] = useState({
    branchId: branches[0].id,
    branchName: branches[0].name,
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    time: "09:00",
    paymentMethod: "cash",
  });

  const calculateTotal = () => {
    let total = 0;
    if (selectedGrooming) {
      total += groomingServices.find(s => s.id === selectedGrooming)?.price || 0;
    }
    selectedTreatments.forEach(id => {
      total += treatmentServices.find(s => s.id === id)?.price || 0;
    });
    selectedCoffee.forEach(id => {
      total += coffeeServices.find(s => s.id === id)?.price || 0;
    });
    return total;
  };

  const getSelectedServiceNames = () => {
    const names: string[] = [];
    if (selectedGrooming) {
      names.push(groomingServices.find(s => s.id === selectedGrooming)?.name || "");
    }
    selectedTreatments.forEach(id => {
      names.push(treatmentServices.find(s => s.id === id)?.name || "");
    });
    selectedCoffee.forEach(id => {
      names.push(coffeeServices.find(s => s.id === id)?.name || "");
    });
    return names.join(", ");
  };

  const toggleTreatment = (id: string) => {
    setSelectedTreatments(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleCoffee = (id: string) => {
    setSelectedCoffee(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleBooking = async () => {
    if (!bookingData.customerName || !bookingData.customerEmail || !bookingData.customerPhone) {
      alert("Mohon lengkapi data diri Anda");
      return;
    }

    if (!selectedGrooming && selectedCoffee.length === 0 && selectedTreatments.length === 0) {
      alert("Mohon pilih setidaknya satu layanan");
      return;
    }

    setIsLoading(true);
    try {
      const totalAmount = calculateTotal();
      
      // 1. Simpan booking ke DB dulu dengan status pending
      const booking = await saveBookingToDb({
        customerName: bookingData.customerName,
        customerPhone: bookingData.customerPhone,
        customerEmail: bookingData.customerEmail,
        serviceId: selectedGrooming || (selectedTreatments[0] || selectedCoffee[0]), 
        branchId: bookingData.branchId,
        barberId: "default",
        appointmentDate: new Date().toISOString(),
        appointmentTime: bookingData.time,
        paymentStatus: bookingData.paymentMethod === "online" ? "pending" : "unpaid",
        status: "pending",
        amount: totalAmount
      });

      // 2. Jika pilih Pembayaran Online (Midtrans), buka Snap popup
      if (bookingData.paymentMethod === "online") {
        const { token } = await createMidtransSnapToken({
          amount: totalAmount,
          customerName: bookingData.customerName,
          customerEmail: bookingData.customerEmail,
          customerPhone: bookingData.customerPhone,
          bookingId: booking.id
        });

        if (window.snap) {
          window.snap.pay(token, {
            onSuccess: function(result: any) {
              console.log('success', result);
              alert("Pembayaran Berhasil! Booking Anda telah dikonfirmasi.");
              window.location.reload();
            },
            onPending: function(result: any) {
              console.log('pending', result);
              alert("Menunggu pembayaran Anda.");
              window.location.reload();
            },
            onError: function(result: any) {
              console.log('error', result);
              alert("Pembayaran Gagal.");
            },
            onClose: function() {
              console.log('customer closed the popup without finishing the payment');
              alert("Anda menutup jendela pembayaran sebelum selesai.");
            }
          });
        }
      } else {
        alert("Booking Berhasil! Silakan datang sesuai jadwal dan bayar di tempat.");
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memproses booking.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="booking-v2" className="py-24 bg-black min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold uppercase tracking-widest mb-4">Booking Appointment</h2>
          <h3 className="text-4xl md:text-5xl font-black text-white">Atur Jadwal Anda</h3>
        </div>

        {/* Stepper */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex justify-between items-center relative">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center z-10">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                    currentStep >= step.id ? "bg-primary text-black" : "bg-secondary-light text-white/40"
                  )}
                >
                  <step.icon size={24} />
                </div>
                <span
                  className={cn(
                    "text-xs mt-2 font-bold uppercase tracking-tighter",
                    currentStep >= step.id ? "text-primary" : "text-white/40"
                  )}
                >
                  {step.name}
                </span>
              </div>
            ))}
            <div className="absolute top-6 left-0 w-full h-[2px] bg-secondary-light -z-0" />
            <motion.div
              className="absolute top-6 left-0 h-[2px] bg-primary -z-0"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto bg-secondary-light/30 border border-white/10 rounded-3xl p-8 md:p-12">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h4 className="text-2xl font-bold text-white mb-6">Pilih Cabang</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {branches.map((branch) => (
                    <div
                      key={branch.id}
                      onClick={() => {
                        setFormData({ ...bookingData, branchId: branch.id, branchName: branch.name });
                        nextStep();
                      }}
                      className={cn(
                        "p-6 rounded-2xl border-2 cursor-pointer transition-all hover:bg-primary/5",
                        bookingData.branchId === branch.id ? "border-primary bg-primary/10" : "border-white/5 bg-black/40"
                      )}
                    >
                      <h5 className="text-xl font-bold text-white">{branch.name}</h5>
                      <p className="text-white/50 text-sm mt-2">{branch.address}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-2xl font-bold text-white">Pilih Layanan</h4>
                  <button onClick={prevStep} className="text-primary text-sm font-bold uppercase hover:underline">
                    &larr; Kembali
                  </button>
                </div>

                {/* Main Category Tabs */}
                <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/5 w-fit">
                  <button
                    onClick={() => setActiveCategory("grooming")}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all",
                      activeCategory === "grooming" ? "bg-primary text-black" : "text-white/40 hover:text-white"
                    )}
                  >
                    <Scissors size={18} />
                    Grooming & Treatments
                  </button>
                  <button
                    onClick={() => setActiveCategory("coffee")}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all",
                      activeCategory === "coffee" ? "bg-primary text-black" : "text-white/40 hover:text-white"
                    )}
                  >
                    <Coffee size={18} />
                    Coffee Shop
                  </button>
                </div>

                {activeCategory === "grooming" ? (
                  <div className="space-y-8">
                    {/* Grooming Section */}
                    <div className="space-y-4">
                      <div className="text-primary font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                        <div className="w-8 h-[2px] bg-primary" />
                        Pilih Menu Grooming
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {groomingServices.map((service) => (
                          <div
                            key={service.id}
                            onClick={() => setSelectedGrooming(service.id)}
                            className={cn(
                              "flex justify-between items-center p-4 rounded-xl border-2 cursor-pointer transition-all",
                              selectedGrooming === service.id ? "border-primary bg-primary/10" : "border-white/5 bg-black/40 hover:bg-white/5"
                            )}
                          >
                            <div>
                              <h5 className="text-white font-bold">{service.name}</h5>
                              <p className="text-white/40 text-xs">{service.duration}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-white font-black text-sm">Rp {service.price.toLocaleString('id-ID')}</span>
                              <div className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                                selectedGrooming === service.id ? "bg-primary border-primary" : "border-white/20"
                              )}>
                                {selectedGrooming === service.id && <Check size={14} className="text-black" />}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Treatments Section */}
                    <div className="space-y-4">
                      <div className="text-primary font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                        <div className="w-8 h-[2px] bg-primary" />
                        Tambah Layanan Treatment
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {treatmentServices.map((service) => (
                          <div
                            key={service.id}
                            onClick={() => toggleTreatment(service.id)}
                            className={cn(
                              "flex justify-between items-center p-4 rounded-xl border-2 cursor-pointer transition-all",
                              selectedTreatments.includes(service.id) ? "border-primary bg-primary/10" : "border-white/5 bg-black/40 hover:bg-white/5"
                            )}
                          >
                            <div className="flex-1 pr-4">
                              <h5 className="text-white font-bold text-sm leading-tight">{service.name}</h5>
                              <p className="text-primary font-black text-xs mt-1">Rp {service.price.toLocaleString('id-ID')}</p>
                            </div>
                            <div className={cn(
                              "w-8 h-8 rounded-lg border-2 flex items-center justify-center shrink-0",
                              selectedTreatments.includes(service.id) ? "bg-primary border-primary" : "border-white/10"
                            )}>
                              {selectedTreatments.includes(service.id) ? <Minus size={16} className="text-black" /> : <Plus size={16} className="text-white/40" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Coffee Section */
                  <div className="space-y-4">
                    <div className="text-primary font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                      <div className="w-8 h-[2px] bg-primary" />
                      Pilih Menu Minuman
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {coffeeServices.map((service) => (
                        <div
                          key={service.id}
                          onClick={() => toggleCoffee(service.id)}
                          className={cn(
                            "flex justify-between items-center p-4 rounded-xl border-2 cursor-pointer transition-all",
                            selectedCoffee.includes(service.id) ? "border-primary bg-primary/10" : "border-white/5 bg-black/40 hover:bg-white/5"
                          )}
                        >
                          <div className="flex-1 pr-4">
                            <h5 className="text-white font-bold text-sm">{service.name}</h5>
                            <p className="text-primary font-black text-xs mt-1">Rp {service.price.toLocaleString('id-ID')}</p>
                          </div>
                          <div className={cn(
                            "w-8 h-8 rounded-lg border-2 flex items-center justify-center shrink-0",
                            selectedCoffee.includes(service.id) ? "bg-primary border-primary" : "border-white/10"
                          )}>
                            {selectedCoffee.includes(service.id) ? <Minus size={16} className="text-black" /> : <Plus size={16} className="text-white/40" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary & Continue */}
                <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <p className="text-white/40 text-xs uppercase font-bold tracking-widest">Total Sementara</p>
                    <h5 className="text-3xl font-black text-primary">Rp {calculateTotal().toLocaleString('id-ID')}</h5>
                    <p className="text-white/60 text-xs mt-1 max-w-[300px] truncate">{getSelectedServiceNames() || "Belum ada layanan dipilih"}</p>
                  </div>
                  <button
                    onClick={nextStep}
                    disabled={!selectedGrooming && selectedCoffee.length === 0 && selectedTreatments.length === 0}
                    className="bg-primary hover:bg-primary-dark text-black px-10 py-4 rounded-xl font-black transition-all flex items-center gap-2 disabled:opacity-30"
                  >
                    LANJUT KE JADWAL <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-2xl font-bold text-white">Pilih Jadwal</h4>
                  <button onClick={prevStep} className="text-primary text-sm font-bold uppercase hover:underline">
                    &larr; Kembali
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-white/70 font-medium">Pilih Jam (Hari Ini)</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "19:00", "20:00"].map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setFormData({ ...bookingData, time });
                          nextStep();
                        }}
                        className={cn(
                          "py-3 rounded-lg border font-bold text-sm transition-all",
                          bookingData.time === time ? "bg-primary text-black border-primary" : "bg-white/5 text-white/60 border-white/10 hover:border-primary/50"
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-2xl font-bold text-white">Data Diri</h4>
                  <button onClick={prevStep} className="text-primary text-sm font-bold uppercase hover:underline">
                    &larr; Kembali
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/70 text-sm mb-2 font-medium">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={bookingData.customerName}
                      onChange={(e) => setFormData({ ...bookingData, customerName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                      placeholder="Masukkan nama Anda"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-2 font-medium">Nomor WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={bookingData.customerPhone}
                      onChange={(e) => setFormData({ ...bookingData, customerPhone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                      placeholder="Contoh: 08123456789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2 font-medium">Email</label>
                  <input
                    type="email"
                    required
                    value={bookingData.customerEmail}
                    onChange={(e) => setFormData({ ...bookingData, customerEmail: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="nama@email.com"
                  />
                </div>

                {/* Payment Method Selection */}
                <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl space-y-4">
                  <h5 className="text-white font-bold flex items-center gap-2">
                    <CreditCard size={20} className="text-primary" />
                    Pilih Metode Pembayaran
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label 
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                        bookingData.paymentMethod === "online" ? "border-primary bg-primary/10" : "border-white/5 bg-black/40"
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={bookingData.paymentMethod === "online"}
                        onChange={() => setFormData({ ...bookingData, paymentMethod: "online" })}
                        className="hidden"
                      />
                      <CreditCard size={20} className={bookingData.paymentMethod === "online" ? "text-primary" : "text-white/40"} />
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-sm">Pembayaran Online</span>
                        <span className="text-white/40 text-[10px]">QRIS, Bank Transfer, CC</span>
                      </div>
                    </label>
                    <label 
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                        bookingData.paymentMethod === "cash" ? "border-primary bg-primary/10" : "border-white/5 bg-black/40"
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        checked={bookingData.paymentMethod === "cash"}
                        onChange={() => setFormData({ ...bookingData, paymentMethod: "cash" })}
                        className="hidden"
                      />
                      <CreditCard size={20} className={bookingData.paymentMethod === "cash" ? "text-primary" : "text-white/40"} />
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-sm">Bayar di Tempat</span>
                        <span className="text-white/40 text-[10px]">Tunai / Cash</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center">
                  <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-2">Ringkasan Pesanan</p>
                  <p className="text-white font-bold text-sm mb-1">{getSelectedServiceNames()}</p>
                  <p className="text-primary font-black text-xl">Total: Rp {calculateTotal().toLocaleString('id-ID')}</p>
                </div>

                <button
                  className="w-full bg-primary hover:bg-primary-dark text-black font-black py-4 rounded-xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleBooking}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      MEMPROSES...
                    </>
                  ) : (
                    "KONFIRMASI BOOKING"
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </section>
  );
}
