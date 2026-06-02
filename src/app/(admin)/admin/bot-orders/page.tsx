"use client";

import { useState, useEffect } from "react";
import { Check, X, ExternalLink, MessageCircle } from "lucide-react";

interface BotOrder {
  id: string;
  waNumber: string;
  totalPrice: number;
  receiptUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
}

export default function BotOrdersPage() {
  const [orders, setOrders] = useState<BotOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Auto refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (id: string) => {
    if (!confirm("Approve this payment?")) return;
    try {
      await fetch(`http://localhost:3001/api/orders/${id}/approve`, { method: 'POST' });
      fetchOrders();
    } catch (err) {
      alert("Error approving order");
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectionReason) return alert("Please provide a reason");
    try {
      await fetch(`http://localhost:3001/api/orders/${id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason })
      });
      setRejectingId(null);
      setRejectionReason("");
      fetchOrders();
    } catch (err) {
      alert("Error rejecting order");
    }
  };

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">WhatsApp Bot Orders</h2>
        <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Manual QRIS Validation
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.length === 0 ? (
          <div className="bg-secondary-light p-12 rounded-3xl border border-white/5 text-center">
            <p className="text-white/40">No orders found</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-secondary-light p-6 rounded-3xl border border-white/5 flex flex-col md:flex-row gap-6 items-center">
              {/* Receipt Thumbnail */}
              <div className="relative group w-32 h-32 flex-shrink-0">
                <img 
                  src={`http://localhost:3001${order.receiptUrl}`} 
                  alt="Receipt" 
                  className="w-full h-full object-cover rounded-2xl border border-white/10"
                />
                <a 
                  href={`http://localhost:3001${order.receiptUrl}`} 
                  target="_blank" 
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity"
                >
                  <ExternalLink size={20} className="text-primary" />
                </a>
              </div>

              {/* Order Info */}
              <div className="flex-1 space-y-2 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <MessageCircle size={16} className="text-primary" />
                  <span className="font-bold text-lg">{order.waNumber}</span>
                </div>
                <p className="text-white/40 text-sm">
                  {new Date(order.createdAt).toLocaleString('id-ID')}
                </p>
                <div className="text-xl font-black text-primary">
                  Rp {order.totalPrice.toLocaleString('id-ID')}
                </div>
                {order.status !== 'pending' && (
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    order.status === 'approved' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {order.status}
                    {order.rejectionReason && `: ${order.rejectionReason}`}
                  </span>
                )}
              </div>

              {/* Actions */}
              {order.status === 'pending' && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleApprove(order.id)}
                    className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-2xl transition-colors"
                    title="Approve"
                  >
                    <Check size={24} />
                  </button>
                  <button 
                    onClick={() => setRejectingId(order.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-2xl transition-colors"
                    title="Reject"
                  >
                    <X size={24} />
                  </button>
                </div>
              )}

              {/* Rejection Modal/Overlay */}
              {rejectingId === order.id && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-secondary-light p-8 rounded-3xl border border-white/10 w-full max-w-md space-y-6">
                    <h3 className="text-xl font-bold">Reject Order</h3>
                    <p className="text-white/60">Provide a reason for rejection. This will be sent to the customer via WhatsApp.</p>
                    <textarea 
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="e.g. Bukti transfer tidak terbaca / Nominal tidak sesuai"
                      className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-primary h-32"
                    />
                    <div className="flex gap-4">
                      <button 
                        onClick={() => { setRejectingId(null); setRejectionReason(""); }}
                        className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-bold transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleReject(order.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 py-4 rounded-2xl font-bold transition-all"
                      >
                        Send Reject
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
