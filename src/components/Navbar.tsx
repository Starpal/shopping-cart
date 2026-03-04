import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShoppingBag, Store, Zap } from 'lucide-react';
import { useCartStore } from '../store/useCartStore'; 

const Navbar: React.FC = () => {
  // Zustand: seleziona solo quello che ci serve (addedItems)
  const addedItems = useCartStore((state) => state.addedItems);
  
  // Calcola il numero totale di oggetti
  const cartCount = addedItems.reduce((total, item) => total + (item.quantity || 0), 0);

  // Helper per gestire le classi attive in React Router v6/v7
  const navLinkClasses = ({ isActive }: { isActive: boolean }) => 
    `flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-all ${
      isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900'
    }`;

  const cartLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `relative p-3 rounded-2xl transition-all ${
      isActive 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
              <Zap className="text-white w-6 h-6 fill-current" />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tighter">
              LEVEL<span className="text-indigo-600">SHOP</span>
            </span>
          </NavLink>

          {/* Links */}
          <div className="flex items-center gap-4 sm:gap-10">
            <NavLink 
              to="/" 
              end
              className={navLinkClasses}
            >
              <Store className="w-4 h-4" />
              <span className="hidden sm:inline">Shop</span>
            </NavLink>

            <NavLink 
              to="/cart" 
              className={cartLinkClasses}
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;