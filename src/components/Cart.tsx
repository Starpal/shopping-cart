import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
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
  Loader2 
} from "lucide-react";
import { RootState } from "../store/store";
import { 
  removeItem, 
  addQuantity, 
  subtractQuantity, 
  checkout 
} from "../store/cartSlice";

const Cart: React.FC = () => {
  const addedItems = useSelector((state: RootState) => state.cart.addedItems);
  const dispatch = useDispatch();
  const history = useHistory();

  // Component States
  const [isShippingChecked, setIsShippingChecked] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "googlepay">("card");
  const [isOrdered, setIsOrdered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- DYNAMIC CALCULATIONS (Bug-Proof Logic) ---
  // Calculates the sum of all items every time the cart changes
  const subtotal = addedItems.reduce((acc, item) => {
    return acc + (item.price * (item.quantity || 1));
  }, 0);

  const shippingCost = isShippingChecked ? 6 : 0;
  const finalTotal = subtotal + shippingCost;

  const handleFinalOrder = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      dispatch(checkout());
      setIsShippingChecked(false);
      setIsProcessing(false);
      setIsOrdered(true);
    }, 2000);
  };

  // SUCCESS VIEW
  if (isOrdered) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10" strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Order Confirmed!</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Payment successful. We've sent the order details to your email.
          </p>
          <button 
            onClick={() => history.push("/")}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl active:scale-95"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* LEFT COLUMN: ITEMS */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-indigo-600" />
              Shopping Cart
            </h2>
            <Link to="/" className="text-sm font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Shop
            </Link>
          </div>

          {addedItems.length > 0 ? (
            <div className="space-y-4">
              {addedItems.map((item) => (
                <div key={item.id} className="flex gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm items-center">
                  <img src={item.img} alt={item.title} className="w-24 h-24 object-cover rounded-2xl bg-slate-50" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{item.title}</h3>
                    <div className="flex items-center gap-4 mt-4">
                      <button onClick={() => dispatch(subtractQuantity(item.id))} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                        <Minus className="w-4 h-4 text-slate-600" />
                      </button>
                      <span className="font-bold text-slate-700">{item.quantity}</span>
                      <button onClick={() => dispatch(addQuantity(item.id))} className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                        <Plus className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900 mb-4 tracking-tight">
                      ${(item.price * (item.quantity || 1)).toFixed(2)}
                    </p>
                    <button onClick={() => dispatch(removeItem(item.id))} className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 ml-auto transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
               <p className="text-slate-400 font-medium mb-6">Your cart is empty.</p>
               <Link to="/" className="inline-flex px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                 Explore Products
               </Link>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        {addedItems.length > 0 && (
          <aside className="lg:w-96">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-24">
              <h3 className="text-xl font-bold mb-8 text-slate-900">Order Summary</h3>
              
              <div className="bg-slate-50 rounded-[2rem] p-6 mb-8 space-y-5">
                {/* Subtotal Row */}
                <div className="flex justify-between text-sm text-slate-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-bold">${subtotal.toFixed(2)}</span>
                </div>
                
                {/* Shipping Row with integrated Toggle */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">Shipping</span>
                    <span className={`font-black tracking-tight ${isShippingChecked ? "text-indigo-600" : "text-emerald-500"}`}>
                      {isShippingChecked ? "+$6.00" : "FREE"}
                    </span>
                  </div>
                  
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        className="peer h-5 w-5 appearance-none rounded-md border-2 border-slate-300 bg-white checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer"
                        checked={isShippingChecked}
                        onChange={() => setIsShippingChecked(!isShippingChecked)}
                      />
                      <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 left-0.5 pointer-events-none" strokeWidth={4} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 group-hover:text-indigo-600 uppercase tracking-wider transition-colors">
                      Express Delivery (+$6.00)
                    </span>
                  </label>
                </div>
                
                <div className="h-px bg-slate-200" />
                
                {/* Final Total Row */}
                <div className="flex justify-between items-center text-2xl font-black text-slate-900 tracking-tight">
                  <span>Total</span>
                  <span className="text-indigo-600">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* PAYMENTS FLOW */}
              {!showPaymentOptions ? (
                <button 
                  onClick={() => setShowPaymentOptions(true)}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-[0.98]"
                >
                  Proceed to Checkout
                </button>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Payment Method</h4>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {(['card', 'paypal', 'googlepay'] as const).map((method) => (
                      <button 
                        key={method} 
                        onClick={() => setPaymentMethod(method)} 
                        className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                          paymentMethod === method 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-600 font-bold' 
                          : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        {method === 'card' && <CreditCard className="w-4 h-4" />}
                        {method === 'paypal' && <Wallet className="w-4 h-4" />}
                        {method === 'googlepay' && <span className="text-xs font-black italic">GPay</span>}
                        <span className="text-[9px] font-bold uppercase">{method.replace('pay', '')}</span>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-2 animate-in fade-in duration-300">
                      <input type="text" placeholder="Card Number" className="w-full p-3 bg-slate-100 border-none rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-600/20" />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="MM/YY" className="w-full p-3 bg-slate-100 border-none rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-600/20" />
                        <input type="text" placeholder="CVC" className="w-full p-3 bg-slate-100 border-none rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-600/20" />
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 pt-2">
                    <button 
                      onClick={handleFinalOrder}
                      disabled={isProcessing}
                      className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${
                        isProcessing 
                        ? 'bg-slate-100 text-slate-400' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        paymentMethod === 'card' ? 'Pay Now' : `Pay with ${paymentMethod.replace('pay', ' Pay')}`
                      )}
                    </button>
                    <button 
                      onClick={() => setShowPaymentOptions(false)} 
                      className="w-full text-[10px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 mt-8 text-slate-300">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Secure SSL Transaction</span>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default Cart;