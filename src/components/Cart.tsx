import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate sostituisce useHistory in v6/v7
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  Check,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
  Wallet,
  ShieldCheck,
  Loader2,
} from "lucide-react";

// Importiamo lo store e il tipo Item
import { useCartStore } from "../store/useCartStore";
import { Item } from "../types";

const Cart: React.FC = () => {
  // Zustand: Estraiamo stato e azioni
  const {
    addedItems,
    total,
    addQuantity,
    subtractQuantity,
    removeItem,
    checkout,
  } = useCartStore();

  const navigate = useNavigate(); // Hook di navigazione moderno

  // Local States
  const [isShippingChecked, setIsShippingChecked] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "paypal" | "googlepay"
  >("card");
  const [isOrdered, setIsOrdered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calcoli dinamici (Il totale base arriva già dallo store)
  const shippingCost = isShippingChecked ? 6 : 0;
  const finalTotal = total + shippingCost;

  const handleFinalOrder = () => {
    setIsProcessing(true);
    // Simulazione del checkout
    setTimeout(() => {
      checkout(); // Resetta il carrello nello store
      setIsOrdered(true);
      setIsProcessing(false);
    }, 2000);
  };

  // SUCCESS VIEW
  if (isOrdered) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Check className="w-12 h-12" strokeWidth={3} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
            Order Placed!
          </h2>
          <p className="text-slate-500 mb-10 text-lg leading-relaxed">
            Your payment was successful. We've sent a confirmation email with
            your tracking number.
          </p>
          <button
            onClick={() => navigate("/")} // Navigazione v7
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-black transition-all shadow-xl active:scale-95"
          >
            Return to Store
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* LEFT COLUMN: SHOPPING CART */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                <ShoppingBag className="w-7 h-7 text-indigo-600" />
              </div>
              Your Cart
            </h2>
            <Link
              to="/"
              className="group text-sm font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-2 transition-all"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Shop
            </Link>
          </div>

          {addedItems.length > 0 ? (
            <div className="space-y-5">
              <AnimatePresence>
                {addedItems.map((item: Item) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={item.id}
                    className="flex gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm items-center hover:shadow-md transition-shadow"
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-2xl bg-slate-50"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800 line-clamp-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-4">
                        <button
                          onClick={() => subtractQuantity(item.id)}
                          className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-600"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-slate-800 text-lg w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addQuantity(item.id)}
                          className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-600"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-slate-900 mb-4">
                        ${(item.price * (item.quantity || 1)).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs font-bold text-rose-400 hover:text-rose-600 flex items-center gap-1 ml-auto transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-28 bg-white rounded-[3.5rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium mb-8 text-lg">
                Your cart is feeling a bit light.
              </p>
              <Link
                to="/"
                className="inline-flex px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SUMMARY SIDEBAR */}
        {addedItems.length > 0 && (
          <aside className="lg:w-96">
            <motion.div
              layout
              className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl shadow-slate-200/50 sticky top-24"
            >
              <h3 className="text-xl font-bold mb-8 text-slate-900">
                Order Summary
              </h3>

              <div className="bg-slate-50 rounded-[2rem] p-7 mb-8 space-y-5">
                <div className="flex justify-between text-sm text-slate-500 font-semibold">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-bold">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-semibold">
                      Shipping
                    </span>
                    <motion.span
                      key={isShippingChecked ? "plus" : "free"}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`font-black tracking-tight ${isShippingChecked ? "text-indigo-600" : "text-emerald-500"}`}
                    >
                      {isShippingChecked ? "+$6.00" : "FREE"}
                    </motion.span>
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer group py-1">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="peer h-5 w-5 appearance-none rounded-md border-2 border-slate-300 bg-white checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer"
                        checked={isShippingChecked}
                        onChange={() =>
                          setIsShippingChecked(!isShippingChecked)
                        }
                      />
                      <Check
                        className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none"
                        strokeWidth={4}
                      />
                    </div>
                    <span className="text-[11px] font-black text-slate-400 group-hover:text-indigo-600 uppercase tracking-widest transition-colors">
                      Express Delivery (24h)
                    </span>
                  </label>
                </div>

                <div className="h-px bg-slate-200" />

                <div className="flex justify-between items-center text-2xl font-black text-slate-900 tracking-tight">
                  <span>Total</span>
                  <motion.span
                    layout
                    transition={{ duration: 0.3 }}
                    className="text-indigo-600"
                  >
                    ${finalTotal.toFixed(2)}
                  </motion.span>
                </div>
              </div>

              {/* PAYMENT FLOW */}
              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {" "}
                  {!showPaymentOptions ? (
                    <motion.div
                      key="summary-btn"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <button
                        onClick={() => setShowPaymentOptions(true)}
                        className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-[0.98]"
                      >
                        Proceed to Checkout
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="payment-options"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-center gap-3">
                        <div className="h-px flex-1 bg-slate-100" />
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          Select Payment
                        </h4>
                        <div className="h-px flex-1 bg-slate-100" />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {(["card", "paypal", "googlepay"] as const).map(
                          (method) => (
                            <button
                              key={method}
                              onClick={() => setPaymentMethod(method)}
                              className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-300 ${
                                paymentMethod === method
                                  ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                                  : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"
                              }`}
                            >
                              {method === "card" && (
                                <CreditCard className="w-5 h-5" />
                              )}
                              {method === "paypal" && (
                                <Wallet className="w-5 h-5" />
                              )}
                              {method === "googlepay" && (
                                <span className="text-sm font-black italic h-5 flex items-center">
                                  GPay
                                </span>
                              )}
                              <span className="text-[9px] font-black uppercase tracking-tighter">
                                {method.replace("pay", "")}
                              </span>
                            </button>
                          )
                        )}
                      </div>
                      {/* CREDIT CARD FORM */}
                      <AnimatePresence>
                        {paymentMethod === "card" && (
                          <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                              marginTop: 24,
                            }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-5 bg-slate-50 rounded-3xl space-y-4 border border-slate-100">
                              {/* Numero Carta */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                  Card Number
                                </label>
                                <input
                                  type="text"
                                  placeholder="0000 0000 0000 0000"
                                  className="w-full bg-white rounded-xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-black transition-all shadow-sm"
                                />
                              </div>

                              {/* Scadenza e CVC */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Expiry
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="MM/YY"
                                    className="w-full bg-white rounded-xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-black transition-all shadow-sm"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    CVC
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="123"
                                    className="w-full bg-white rounded-xl p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-black transition-all shadow-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="pt-2">
                        <button
                          onClick={handleFinalOrder}
                          disabled={isProcessing}
                          className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${
                            isProcessing
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 active:scale-95"
                          }`}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-6 h-6 animate-spin" />
                              <span>Validating...</span>
                            </>
                          ) : (
                            "Pay Securely"
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-center gap-2 mt-8 text-slate-300">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Secure SSL Transaction
                </span>
              </div>
            </motion.div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default Cart;
