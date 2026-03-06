import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import confetti from "canvas-confetti";
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
import { useCartStore } from "../store/useCartStore";
import { Item, CardFormData } from "../types";

const Cart: React.FC = () => {
  const {
    addedItems,
    total,
    addQuantity,
    subtractQuantity,
    removeItem,
    checkout,
  } = useCartStore();
  const navigate = useNavigate();

  // Init React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CardFormData>();

  const [isShippingChecked, setIsShippingChecked] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "paypal" | "googlepay"
  >("card");
  const [isOrdered, setIsOrdered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const shippingCost = isShippingChecked ? 6 : 0;
  const finalTotal = total + shippingCost;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, ""); // Only numbers
    v = v.match(/.{1,4}/g)?.join(" ") || v; // Space every 4 digits
    setValue("cardNumber", v.substring(0, 19)); // Update Hook Form
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, ""); // Remove everything except numbers
    if (v.length >= 2) {
      v = v.substring(0, 2) + "/" + v.substring(2, 4); // Insert slash after first 2
    }
    setValue("expiry", v); // Update the value in the form
  };

  // Fire confetti on successful order placement
  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#10b981", "#f59e0b"],
    });
  };

  const handleFinalOrder = (data: CardFormData) => {
    setIsProcessing(true);
    setTimeout(() => {
      checkout();
      setIsOrdered(true);
      setIsProcessing(false);
      fireConfetti();
    }, 2000);
  };

  if (isOrdered) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Check className="w-12 h-12" strokeWidth={3} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
            Order Placed!
          </h2>
          <p className="text-slate-500 mb-10 text-lg">
            Your payment was successful.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-black shadow-xl"
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
              className="text-sm font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Shop
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
                    className="flex gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm items-center"
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-2xl bg-slate-50"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-4">
                        <button
                          onClick={() => subtractQuantity(item.id)}
                          className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-200"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-slate-800 text-lg">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addQuantity(item.id)}
                          className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center hover:bg-slate-200"
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
                        className="text-xs font-bold text-rose-400 hover:text-rose-600 flex items-center gap-1 ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20 font-bold text-slate-400">
              Your cart is empty
            </div>
          )}
        </div>

        <aside className="lg:w-96">
          <motion.div
            layout
            className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl sticky top-24"
          >
            <h3 className="text-xl font-bold mb-8 text-slate-900">
              Order Summary
            </h3>
            <div className="bg-slate-50 rounded-[2rem] p-7 mb-8 space-y-5">
              <div className="flex justify-between text-sm text-slate-500 font-semibold">
                <span>Subtotal</span>{" "}
                <span className="text-slate-900 font-bold">
                  ${total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-semibold">Shipping</span>
                <span
                  className={`font-black ${isShippingChecked ? "text-indigo-600" : "text-emerald-500"}`}
                >
                  {isShippingChecked ? "+$6.00" : "FREE"}
                </span>
              </div>
              <label className="flex items-center gap-3 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={isShippingChecked}
                  onChange={() => setIsShippingChecked(!isShippingChecked)}
                  className="h-5 w-5 accent-indigo-600"
                />
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Express Delivery
                </span>
              </label>
              <div className="h-px bg-slate-200" />
              <div className="flex justify-between items-center text-2xl font-black text-slate-900">
                <span>Total</span>{" "}
                <span className="text-indigo-600">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="relative overflow-hidden">
              <AnimatePresence mode="popLayout">
                {!showPaymentOptions ? (
                  <motion.div
                    key="btn"
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      y: -20,
                      position: "absolute",
                      width: "100%",
                    }}
                  >
                    <button
                      onClick={() => setShowPaymentOptions(true)}
                      className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl active:scale-95"
                    >
                      Proceed to Checkout
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="pay"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {(["card", "paypal", "googlepay"] as const).map(
                        (method) => (
                          <button
                            key={method}
                            onClick={() => setPaymentMethod(method)}
                            className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === method ? "border-indigo-600 bg-indigo-50 text-indigo-600" : "border-slate-50 text-slate-400"}`}
                          >
                            {method === "card" && (
                              <CreditCard className="w-5 h-5" />
                            )}
                            {method === "paypal" && (
                              <Wallet className="w-5 h-5" />
                            )}
                            {method === "googlepay" && (
                              <span className="text-sm font-black italic">
                                GPay
                              </span>
                            )}
                            <span className="text-[9px] font-black uppercase">
                              {method.replace("pay", "")}
                            </span>
                          </button>
                        ),
                      )}
                    </div>
                    {/* CREDIT CARD FORM */}
                    <AnimatePresence>
                      {paymentMethod === "card" && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 bg-slate-50 rounded-3xl space-y-4 border border-slate-100">
                            <div className="space-y-1">
                              <div className="flex justify-between px-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                  Card Number
                                </label>
                                {errors.cardNumber && (
                                  <span className="text-[9px] text-rose-500 font-bold uppercase italic">
                                    16 digits req.
                                  </span>
                                )}
                              </div>
                              <input
                                {...register("cardNumber", {
                                  required: true,
                                  minLength: 19,
                                })}
                                onChange={handleCardNumberChange}
                                placeholder="0000 0000 0000 0000"
                                className={`w-full bg-white rounded-xl p-4 text-sm font-medium outline-none border-2 ${errors.cardNumber ? "border-rose-400" : "focus:border-black border-transparent"}`}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                  Expiry
                                </label>
                                <input
                                  {...register("expiry", {
                                    required: true,
                                    minLength: 5,
                                  })}
                                  onChange={handleExpiryChange}
                                  placeholder="MM/YY"
                                  maxLength={5}
                                  className={`w-full bg-white rounded-xl p-4 text-sm font-medium outline-none border-2 ${errors.expiry ? "border-rose-400" : "focus:border-black border-transparent"}`}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                  CVC
                                </label>
                                <input
                                  {...register("cvc", {
                                    required: true,
                                    minLength: 3,
                                    maxLength: 3,
                                  })}
                                  placeholder="123"
                                  maxLength={3}
                                  className={`w-full bg-white rounded-xl p-4 text-sm font-medium outline-none border-2 ${errors.cvc ? "border-rose-400" : "focus:border-black border-transparent"}`}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="pt-2">
                      <button
                        onClick={
                          paymentMethod === "card"
                            ? handleSubmit(handleFinalOrder)
                            : () =>
                                handleFinalOrder({
                                  cardNumber: "",
                                  expiry: "",
                                  cvc: "",
                                })
                        }
                        disabled={isProcessing}
                        className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 ${isProcessing ? "bg-slate-100 text-slate-400" : "bg-indigo-600 text-white shadow-xl active:scale-95"}`}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />{" "}
                            Validating...
                          </>
                        ) : (
                          "Pay Securely"
                        )}
                      </button>
                      <button
                        onClick={() => setShowPaymentOptions(false)}
                        className="w-full mt-4 text-[10px] font-black text-slate-300 uppercase tracking-widest"
                      >
                        Cancel
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
      </div>
    </div>
  );
};

export default Cart;
