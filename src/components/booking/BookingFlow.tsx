"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, MapPin, Scissors, Calendar as CalendarIcon, Loader2, CreditCard, QrCode, X, Clock, Coffee, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveBookingToDb, createMidtransSnapToken, getBranches } from "@/actions/booking";

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

export default function BookingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<"grooming" | "coffee">("grooming");
  
  const [selectedGrooming, setSelectedGrooming] = useState<string | null>(null);
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [selectedCoffee, setSelectedCoffee] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  const [bookingData, setFormData] = useState({
    branchId: "",
    branchName: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    time: "09:00",
    paymentMethod: "cash",
  });

  useEffect(() => {
    const initData = async () => {
      try {
        const dbBranches = await getBranches();
        setBranches(dbBranches);
        if (dbBranches.length > 0) {
          setFormData(prev => ({ 
            ...prev, 
            branchId: dbBranches[0].id, 
            branchName: dbBranches[0].name 
          }));
        }
      } catch (err) {
        console.error("Error fetching branches:", err);
      }
    };
    initData();
  }, []);

  useEffect(() => {
    if (bookingData.branchId) {
      const selectedBranch = branches.find(b => b.id === bookingData.branchId);
      if (selectedBranch) {
        setServices(selectedBranch.services || []);
      }
    }
  }, [bookingData.branchId, branches]);

  const groomingServices = services.filter(s => !s.name.toLowerCase().includes("coffee") && s.price >= 50000);
  const treatmentServices = services.filter(s => !s.name.toLowerCase().includes("coffee") && s.price < 50000);
  const coffeeServices = services.filter(s => s.name.toLowerCase().includes("coffee"));

  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const barberId = "barber1"; // Idealnya dinamis sesuai barber yang dipilih
        const res = await fetch(`/api/admin/schedules?barberId=${barberId}&date=${new Date().toISOString().split('T')[0]}`);
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const booked = data.filter((s: any) => s.status === "booked" || s.status === "pending").map((s: any) => s.startTime);
          setBookedSlots(booked);
        } else {
          console.warn("Received non-array data from schedules API:", data);
          setBookedSlots([]);
        }
      } catch (err) {
        console.error("Error fetching slots:", err);
      }
    };
    fetchBookedSlots();
  }, [currentStep]);

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

  const coffeeEnabled = coffeeServices.length > 0;

  useEffect(() => {
    if (coffeeEnabled) return;
    if (activeCategory === "coffee") setActiveCategory("grooming");
    if (selectedCoffee.length > 0) setSelectedCoffee([]);
  }, [coffeeEnabled, activeCategory, selectedCoffee.length]);

  const calculateTotal = () => {
    let total = 0;
    if (selectedGrooming) {
      total += Number(groomingServices.find(s => s.id === selectedGrooming)?.price) || 0;
    }
    selectedTreatments.forEach(id => {
      total += Number(treatmentServices.find(s => s.id === id)?.price) || 0;
    });
    selectedCoffee.forEach(id => {
      total += Number(coffeeServices.find(s => s.id === id)?.price) || 0;
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
              setBookingSuccess({
                id: booking.id,
                customerName: bookingData.customerName,
                time: bookingData.time,
                branch: bookingData.branchName,
                paymentStatus: "paid"
              });
            },
            onPending: function(result: any) {
              console.log('pending', result);
              setBookingSuccess({
                id: booking.id,
                customerName: bookingData.customerName,
                time: bookingData.time,
                branch: bookingData.branchName,
                paymentStatus: "pending"
              });
            },
            onError: function(result: any) {
              console.log('error', result);
              alert("Pembayaran Gagal. Silakan coba lagi.");
            },
            onClose: function() {
              console.log('customer closed the popup without finishing the payment');
              alert("Anda menutup jendela pembayaran sebelum selesai.");
            }
          });
        }
      } else {
        setBookingSuccess({
          id: booking.id,
          customerName: bookingData.customerName,
          time: bookingData.time,
          branch: bookingData.branchName,
          paymentStatus: "cash"
        });
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Terjadi kesalahan saat memproses booking.");
    } finally {
      setIsLoading(false);
    }
  };

  if (bookingSuccess) {
    return (
      <section className="py-24 bg-black min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-secondary-light/30 border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl backdrop-blur-sm"
          >
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 text-primary shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              <Check size={40} strokeWidth={3} />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black mb-4">Booking Berhasil!</h2>
            <p className="text-white/60 mb-8">
              Terima kasih, <span className="text-white font-bold">{bookingSuccess.customerName}</span>. 
              Pesanan Anda telah kami terima dan tercatat di sistem kami.
            </p>

            <div className="bg-black/40 rounded-2xl p-6 mb-8 text-left space-y-4 border border-white/5">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-white/40 text-sm uppercase tracking-widest font-bold">Booking ID</span>
                <span className="font-mono text-primary font-bold">#{bookingSuccess.id.slice(-6).toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Cabang</p>
                  <p className="font-bold text-sm">{bookingSuccess.branch}</p>
                </div>
                <div>
                  <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Waktu</p>
                  <p className="font-bold text-sm">{bookingSuccess.time}</p>
                </div>
                <div>
                  <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mb-1">Status Pembayaran</p>
                  <p className={cn(
                    "font-black text-[10px] uppercase px-2 py-1 rounded-md w-fit",
                    bookingSuccess.paymentStatus === "paid" ? "bg-green-500/10 text-green-400" : 
                    bookingSuccess.paymentStatus === "pending" ? "bg-yellow-500/10 text-yellow-400" :
                    "bg-blue-500/10 text-blue-400"
                  )}>
                    {bookingSuccess.paymentStatus === "paid" ? "Sudah Dibayar" : 
                     bookingSuccess.paymentStatus === "pending" ? "Menunggu Pembayaran" : 
                     "Bayar di Tempat"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-white/40 italic">
                *Silakan tunjukkan halaman ini atau sebutkan Nama/Booking ID saat tiba di lokasi.
              </p>
              <button 
                onClick={() => window.location.href = "/"}
                className="bg-primary text-black font-black px-8 py-4 rounded-xl hover:bg-primary-dark transition-all shadow-lg"
              >
                Kembali ke Beranda
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking-v2" className="py-12 md:py-24 bg-black min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-primary font-bold text-xs md:text-sm uppercase tracking-[0.3em] mb-3 md:mb-4">Booking Appointment</h2>
          <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">Atur Jadwal Anda</h3>
        </div>

        {/* Stepper */}
        <div className="max-w-4xl mx-auto mb-10 md:mb-12 overflow-hidden px-2">
          <div className="flex justify-between items-center relative">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center z-10">
                <div
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300",
                    currentStep >= step.id ? "bg-primary text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]" : "bg-secondary-light text-white/40"
                  )}
                >
                  <step.icon size={18} className="md:hidden" />
                  <step.icon size={24} className="hidden md:block" />
                </div>
                <span
                  className={cn(
                    "text-[8px] md:text-xs mt-2 font-bold uppercase tracking-tighter text-center",
                    currentStep >= step.id ? "text-primary" : "text-white/40"
                  )}
                >
                  {step.name}
                </span>
              </div>
            ))}
            <div className="absolute top-5 md:top-6 left-0 w-full h-[1px] md:h-[2px] bg-secondary-light -z-0" />
            <motion.div
              className="absolute top-5 md:top-6 left-0 h-[1px] md:h-[2px] bg-primary -z-0 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto bg-secondary-light/30 border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-12 shadow-2xl backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h4 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Pilih Cabang</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {branches.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-white/40">
                      <p>Tidak ada cabang yang tersedia saat ini.</p>
                    </div>
                  ) : (
                    branches.map((branch) => (
                      <div
                        key={branch.id}
                        onClick={() => {
                          setFormData({ ...bookingData, branchId: branch.id, branchName: branch.name });
                          nextStep();
                        }}
                        className={cn(
                          "p-5 md:p-6 rounded-xl md:rounded-2xl border-2 cursor-pointer transition-all hover:bg-primary/5",
                          bookingData.branchId === branch.id ? "border-primary bg-primary/10 shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]" : "border-white/5 bg-black/40"
                        )}
                      >
                        <h5 className="text-lg md:text-xl font-bold text-white">{branch.name}</h5>
                        <p className="text-white/50 text-xs md:text-sm mt-2 leading-relaxed">{branch.address}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 md:space-y-8"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-xl md:text-2xl font-bold text-white">Pilih Layanan</h4>
                  <button onClick={prevStep} className="text-primary text-xs md:text-sm font-bold uppercase hover:underline">
                    &larr; Kembali
                  </button>
                </div>

                {/* Main Category Tabs - Scrollable on mobile */}
                <div className="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/5 w-full overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setActiveCategory("grooming")}
                    className={cn(
                      "flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-bold text-[10px] md:text-sm transition-all whitespace-nowrap flex-1 md:flex-none",
                      activeCategory === "grooming" ? "bg-primary text-black" : "text-white/40 hover:text-white"
                    )}
                  >
                    <Scissors size={16} className="md:w-[18px] md:h-[18px]" />
                    Grooming & Treatments
                  </button>
                  {coffeeEnabled && (
                    <button
                      onClick={() => setActiveCategory("coffee")}
                      className={cn(
                        "flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-bold text-[10px] md:text-sm transition-all whitespace-nowrap flex-1 md:flex-none",
                        activeCategory === "coffee" ? "bg-primary text-black" : "text-white/40 hover:text-white"
                      )}
                    >
                      <Coffee size={16} className="md:w-[18px] md:h-[18px]" />
                      Coffee Shop
                    </button>
                  )}
                </div>
                {!coffeeEnabled && (
                  <p className="text-white/40 text-[10px] md:text-xs">
                    Menu Coffee hanya tersedia di cabang PasirKaliki.
                  </p>
                )}

                {activeCategory === "grooming" ? (
                  <div className="space-y-6 md:space-y-8">
                    {/* Grooming Section */}
                    <div className="space-y-4">
                      <div className="text-primary font-bold text-[10px] md:text-sm uppercase tracking-widest flex items-center gap-2">
                        <div className="w-6 md:w-8 h-[2px] bg-primary" />
                        Menu Grooming
                      </div>
                      <div className="grid grid-cols-1 gap-2 md:gap-3">
                        {groomingServices.map((service) => (
                          <div
                            key={service.id}
                            onClick={() => setSelectedGrooming(service.id)}
                            className={cn(
                              "flex justify-between items-center p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all",
                              selectedGrooming === service.id ? "border-primary bg-primary/10" : "border-white/5 bg-black/40 hover:bg-white/5"
                            )}
                          >
                            <div className="flex items-center gap-3 md:gap-4">
                              {(service as any).image && (
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                                  <img 
                                    src={(service as any).image} 
                                    alt={`Layanan ${service.name}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <h5 className="text-white font-bold text-sm md:text-base leading-tight">{service.name}</h5>
                                <p className="text-white/40 text-[10px] md:text-xs">{service.duration}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 md:gap-3">
                              <span className="text-white font-black text-xs md:text-sm whitespace-nowrap">Rp {Number(service.price).toLocaleString('id-ID')}</span>
                              <div className={cn(
                                "w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center shrink-0",
                                selectedGrooming === service.id ? "bg-primary border-primary" : "border-white/20"
                              )}>
                                {selectedGrooming === service.id && <Check size={12} className="text-black" />}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Treatments Section */}
                    <div className="space-y-4">
                      <div className="text-primary font-bold text-[10px] md:text-sm uppercase tracking-widest flex items-center gap-2">
                        <div className="w-6 md:w-8 h-[2px] bg-primary" />
                        Treatment Tambahan
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                        {treatmentServices.map((service) => (
                          <div
                            key={service.id}
                            onClick={() => toggleTreatment(service.id)}
                            className={cn(
                              "flex justify-between items-center p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all",
                              selectedTreatments.includes(service.id) ? "border-primary bg-primary/10" : "border-white/5 bg-black/40 hover:bg-white/5"
                            )}
                          >
                            <div className="flex-1 pr-2 md:pr-4">
                              <h5 className="text-white font-bold text-xs md:text-sm leading-tight">{service.name}</h5>
                              <p className="text-primary font-black text-[10px] md:text-xs mt-1">Rp {Number(service.price).toLocaleString('id-ID')}</p>
                            </div>
                            <div className={cn(
                              "w-7 h-7 md:w-8 md:h-8 rounded-lg border-2 flex items-center justify-center shrink-0",
                              selectedTreatments.includes(service.id) ? "bg-primary border-primary" : "border-white/10"
                            )}>
                              {selectedTreatments.includes(service.id) ? <Minus size={14} className="text-black" /> : <Plus size={14} className="text-white/40" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Coffee Section */
                  <div className="space-y-4">
                    <div className="text-primary font-bold text-[10px] md:text-sm uppercase tracking-widest flex items-center gap-2">
                      <div className="w-6 md:w-8 h-[2px] bg-primary" />
                      Menu Minuman
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                      {coffeeServices.map((service) => (
                        <div
                          key={service.id}
                          onClick={() => toggleCoffee(service.id)}
                          className={cn(
                            "flex justify-between items-center p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all",
                            selectedCoffee.includes(service.id) ? "border-primary bg-primary/10" : "border-white/5 bg-black/40 hover:bg-white/5"
                          )}
                        >
                          <div className="flex-1 pr-2 md:pr-4">
                            <h5 className="text-white font-bold text-xs md:text-sm">{service.name}</h5>
                            <p className="text-primary font-black text-[10px] md:text-xs mt-1">Rp {Number(service.price).toLocaleString('id-ID')}</p>
                          </div>
                          <div className={cn(
                            "w-7 h-7 md:w-8 md:h-8 rounded-lg border-2 flex items-center justify-center shrink-0",
                            selectedCoffee.includes(service.id) ? "bg-primary border-primary" : "border-white/10"
                          )}>
                            {selectedCoffee.includes(service.id) ? <Minus size={14} className="text-black" /> : <Plus size={14} className="text-white/40" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary & Continue */}
                <div className="mt-8 md:mt-12 p-5 md:p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
                  <div className="text-center md:text-left w-full md:w-auto">
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Total Sementara</p>
                    <h5 className="text-2xl md:text-3xl font-black text-primary">Rp {calculateTotal().toLocaleString('id-ID')}</h5>
                    <p className="text-white/60 text-[10px] md:text-xs mt-1 max-w-[300px] truncate mx-auto md:mx-0">{getSelectedServiceNames() || "Belum ada layanan dipilih"}</p>
                  </div>
                  <button
                    onClick={nextStep}
                    disabled={!selectedGrooming && selectedCoffee.length === 0 && selectedTreatments.length === 0}
                    className="w-full md:w-auto bg-primary hover:bg-primary-dark text-black px-8 md:px-10 py-3.5 md:py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2 disabled:opacity-30 text-sm md:text-base"
                  >
                    LANJUT KE JADWAL <ChevronRight size={18} />
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
                className="space-y-6 md:space-y-8"
              >
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h4 className="text-xl md:text-2xl font-bold text-white">Pilih Jadwal</h4>
                  <button onClick={prevStep} className="text-primary text-xs md:text-sm font-bold uppercase hover:underline">
                    &larr; Kembali
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-white/70 font-medium text-sm md:text-base">Pilih Jam (Hari Ini)</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 md:gap-3">
                    {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "19:00", "19:30", "20:00", "20:30"].map((time) => {
                      const isBooked = bookedSlots.includes(time);
                      return (
                        <button
                          key={time}
                          disabled={isBooked}
                          onClick={() => {
                            setFormData({ ...bookingData, time });
                            nextStep();
                          }}
                          className={cn(
                            "py-2.5 md:py-3 rounded-lg border font-bold text-xs md:text-sm transition-all",
                            bookingData.time === time ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(212,175,55,0.3)]" : 
                            isBooked ? "bg-red-400/10 text-red-400/40 border-red-400/10 cursor-not-allowed" :
                            "bg-white/5 text-white/60 border-white/10 hover:border-primary/50"
                          )}
                        >
                          {time}
                          {isBooked && <span className="block text-[7px] md:text-[8px] mt-0.5 opacity-60">Full</span>}
                        </button>
                      );
                    })}
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
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h4 className="text-xl md:text-2xl font-bold text-white">Data Diri</h4>
                  <button onClick={prevStep} className="text-primary text-xs md:text-sm font-bold uppercase hover:underline">
                    &larr; Kembali
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-white/70 text-xs md:text-sm mb-2 font-medium">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={bookingData.customerName}
                      onChange={(e) => setFormData({ ...bookingData, customerName: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:py-3.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                      placeholder="Masukkan nama Anda"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-xs md:text-sm mb-2 font-medium">Nomor WhatsApp</label>
                    <input
                      type="tel"
                      required
                      value={bookingData.customerPhone}
                      onChange={(e) => setFormData({ ...bookingData, customerPhone: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:py-3.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                      placeholder="Contoh: 08123456789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-xs md:text-sm mb-2 font-medium">Email</label>
                  <input
                    type="email"
                    required
                    value={bookingData.customerEmail}
                    onChange={(e) => setFormData({ ...bookingData, customerEmail: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:py-3.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                    placeholder="nama@email.com"
                  />
                </div>

                {/* Payment Method Selection */}
                <div className="p-4 md:p-6 bg-primary/5 border border-primary/20 rounded-2xl space-y-4">
                  <h5 className="text-white font-bold text-sm md:text-base flex items-center gap-2">
                    <CreditCard size={18} className="text-primary" />
                    Metode Pembayaran
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <label 
                      className={cn(
                        "flex items-center gap-3 p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all",
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
                      <QrCode size={20} className={bookingData.paymentMethod === "online" ? "text-primary" : "text-white/40"} />
                      <div className="flex flex-col">
                        <span className="text-white font-bold text-xs md:text-sm">Pembayaran Online</span>
                        <span className="text-white/40 text-[9px] md:text-[10px]">QRIS, Transfer, CC</span>
                      </div>
                    </label>
                    <label 
                      className={cn(
                        "flex items-center gap-3 p-3 md:p-4 rounded-xl border-2 cursor-pointer transition-all",
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
                        <span className="text-white font-bold text-xs md:text-sm">Bayar di Tempat</span>
                        <span className="text-white/40 text-[9px] md:text-[10px]">Tunai / Cash</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl text-center">
                  <p className="text-white/40 text-[9px] md:text-[10px] uppercase font-bold tracking-widest mb-1 md:mb-2">Ringkasan Pesanan</p>
                  <p className="text-white font-bold text-xs md:text-sm mb-1 leading-tight">{getSelectedServiceNames()}</p>
                  <p className="text-primary font-black text-lg md:text-xl">Total: Rp {calculateTotal().toLocaleString('id-ID')}</p>
                </div>

                <button
                  className="w-full bg-primary hover:bg-primary-dark text-black font-black py-4 rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(212,175,55,0.2)]"
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
