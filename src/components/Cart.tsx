import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, Check, ShoppingBag } from "lucide-react"; // Icons
import { RootState } from "../store/store";
import { 
  removeItem, 
  addQuantity, 
  subtractQuantity, 
  addShipping, 
  subShipping 
} from "../store/cartSlice";

const Cart: React.FC = () => {
  const addedItems = useSelector((state: RootState) => state.cart.addedItems);
  const total = useSelector((state: RootState) => state.cart.total);
  const dispatch = useDispatch();
  const [isShippingChecked, setIsShippingChecked] = useState(false);

  useEffect(() => {
    return () => {
      if (isShippingChecked) dispatch(subShipping());
    };
  }, [isShippingChecked, dispatch]);

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsShippingChecked(checked);
    checked ? dispatch(addShipping()) : dispatch(subShipping());
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Items List */}
        <div className="flex-1">
          <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-indigo-600" />
            Shopping Cart
          </h2>
          {addedItems.length > 0 ? (
            <ul className="space-y-4">
              {addedItems.map((item) => (
                <li key={item.id} className="flex gap-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm items-center">
                  <img src={item.img} alt={item.title} className="w-24 h-24 object-cover rounded-2xl bg-slate-50" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                    <div className="flex items-center gap-4 mt-4">
                      <button 
                        onClick={() => dispatch(subtractQuantity(item.id))} 
                        className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-slate-700">{item.quantity}</span>
                      <button 
                        onClick={() => dispatch(addQuantity(item.id))} 
                        className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900 mb-4">${(item.price * (item.quantity || 1)).toFixed(2)}</p>
                    <button 
                      onClick={() => dispatch(removeItem(item.id))} 
                      className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
               <p className="text-slate-400 mb-4">Cart is empty.</p>
               <Link to="/" className="text-indigo-600 font-bold hover:underline">Go back to shop</Link>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        {addedItems.length > 0 && (
          <aside className="lg:w-96">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white sticky top-24 shadow-2xl">
              <h3 className="text-xl font-bold mb-6 tracking-tight">Order Summary</h3>
              <div className="space-y-6 mb-8">
                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-600 bg-slate-700 checked:bg-indigo-500 transition-all"
                        checked={isShippingChecked}
                        onChange={handleShippingChange}
                      />
                      <Check className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-0.5" strokeWidth={4} />
                    </div>
                    <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                      Express Shipping (+ $6.00)
                    </span>
                  </label>
                </div>

                <div className="space-y-4 text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="text-white font-medium">${(total - (isShippingChecked ? 6 : 0)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Cost</span>
                    <span className={isShippingChecked ? "text-indigo-400 font-bold" : "text-emerald-400 font-medium"}>
                      {isShippingChecked ? "+$6.00" : "Free Standard"}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-slate-800" />
                <div className="flex justify-between text-2xl font-black">
                  <span>Total</span>
                  <span className="text-white">${total.toFixed(2)}</span>
                </div>
              </div>
              <button className="w-full bg-indigo-600 py-4 rounded-2xl font-bold hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-600/20">
                Checkout
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default Cart;