import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus } from "lucide-react";
import { RootState, AppDispatch } from "../store/store";
import { addToCart, fetchApiProducts } from "../store/cartSlice";

const Home: React.FC = () => {
  const { items, status } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    // Only fetch if we haven't loaded them yet
    if (status === "idle") {
      dispatch(fetchApiProducts());
    }
  }, [status, dispatch]);

  const handleAddToCart = (id: number) => {
    dispatch(addToCart(id));
  };

  // Filter logic for clothing and Accessories
  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    if (filter === "clothing") return item.category?.includes("clothing");
    if (filter === "accessories")
      return item.category === "jewelery" || item.category === "electronics";
    return true;
  });

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Our Collection
            </h1>
            <p className="text-slate-500 mt-2">
              Premium quality for your unique style.
            </p>
          </div>

          {/* Category Filter Bar */}
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
            {["all", "clothing", "accessories"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all capitalize ${
                  filter === cat
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {status === "loading" && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <button
                  onClick={() => handleAddToCart(item.id)}
                  className="absolute bottom-6 right-6 bg-white text-slate-900 p-4 rounded-2xl shadow-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:bg-indigo-600 hover:text-white"
                >
                  <Plus className="w-6 h-6" strokeWidth={2.5} />
                </button>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1">
                    {item.title}
                  </h3>
                  <span className="text-indigo-600 font-black">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-slate-500 text-sm line-clamp-2">
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
