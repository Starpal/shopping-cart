import React, { useEffect, useState, useRef } from "react";
import { useCartStore } from "../store/useCartStore";
import { Loader2, Sparkles, ShoppingBag } from "lucide-react";

const Home: React.FC = () => {
  const { items, status, hasMore, fetchApiProducts, setFilterAndFetch, addToCart } = useCartStore();
  const [activeTab, setActiveTab] = useState("all");
  
  // Riferimento per l'elemento invisibile che triggera il caricamento
  const observerTarget = useRef<HTMLDivElement>(null);

  // Caricamento iniziale (sync locali + API)
  useEffect(() => {
    if (activeTab === "all" && status === "idle") {
      fetchApiProducts("all");
    }
  }, [activeTab, status, fetchApiProducts]);

  // Logica Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Se la "sentinella" entra nel viewport e ci sono altri dati da caricare
        if (entries[0].isIntersecting && hasMore && status !== "loading") {
          fetchApiProducts(activeTab);
        }
      },
      { threshold: 0.1 } // Si attiva appena un pezzetto della sentinella è visibile
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, status, activeTab, fetchApiProducts]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setFilterAndFetch(tab);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Nav */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 flex items-center gap-2">
              Explore <Sparkles className="text-indigo-500 fill-indigo-500 w-8 h-8" />
            </h1>
            <p className="text-slate-500 font-medium mt-1">Discover our latest arrivals</p>
          </div>

          <nav className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 w-fit">
            {["all", "clothing", "accessories"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </header>

        {/* Griglia Prodotti */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {items.map((item) => (
            <article
              key={item.id}
              className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-50">
                <img src={item.img} alt={item.title} className="w-full h-full object-contain p-8 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{item.title}</h3>
                  <span className="text-indigo-600 font-black">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 mb-6">{item.desc}</p>
                <button
                  onClick={() => addToCart(item.id)}
                  className="w-full bg-slate-50 hover:bg-indigo-600 text-slate-900 hover:text-white py-3.5 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to cart
                </button>
              </div>
            </article>
          ))}
        </section>

        {/* Sentinella per Infinite Scroll */}
        <div ref={observerTarget} className="mt-12 py-10 flex flex-col items-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading treasures...</p>
            </>
          )}
          {!hasMore && items.length > 10 && (
            <p className="text-slate-400 text-sm font-medium italic">No more items to show.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;