import React from "react";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Item } from "../types";
import { useCartStore } from "../store/useCartStore";

interface ProductCardProps {
  item: Item;
}

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      {/* Immagine */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Contenuto Card */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-baseline mb-2">
          <h3 className="text-sm font-bold text-slate-800 line-clamp-1 pr-2">
            {item.title}
          </h3>
          <span className="text-indigo-600 font-black text-base whitespace-nowrap">
            ${item.price.toFixed(2)}
          </span>
        </div>

        <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-6">
          {item.desc}
        </p>

        {/* Bottone sempre in fondo */}
        <button
          onClick={() => addToCart(item.id)}
          className="mt-auto w-full bg-slate-50 hover:bg-indigo-600 text-slate-900 hover:text-white py-3.5 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2 group/btn"
        >
          <ShoppingBag className="w-4 h-4 group-hover/btn:animate-bounce" />
          Add to cart
        </button>
      </div>
    </motion.article>
  );
};

export default ProductCard;