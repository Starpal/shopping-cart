import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus } from "lucide-react"; // Import Plus icon
import { RootState } from "../store/store";
import { addToCart } from "../store/cartSlice";

const Home: React.FC = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const handleAddToCart = (id: number) => {
    dispatch(addToCart(id));
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Our Collection
          </h1>
          <p className="text-slate-500 mt-2">
            Premium quality for your unique style.
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {items.map((item) => (
            <article
              key={item.id}
              className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
                <button
                  onClick={() => handleAddToCart(item.id)}
                  className="absolute bottom-6 right-6 bg-white text-slate-900 p-4 rounded-2xl shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-indigo-600 hover:text-white"
                  aria-label={`Add ${item.title} to cart`}
                >
                  {/* Clean Lucide Icon */}
                  <Plus className="w-6 h-6" strokeWidth={2.5} />
                </button>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-800">
                    {item.title}
                  </h3>
                  <span className="text-indigo-600 font-black text-lg">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
};

export default Home;