import React, { useEffect, useState } from "react";
import { useCartStore } from "../store/useCartStore";
import { Loader2, Sparkles, ShoppingBag } from "lucide-react";

const Home: React.FC = () => {
  // Estraiamo tutto il necessario dallo store aggiornato
  const {
    items,
    status,
    hasMore,
    fetchApiProducts,
    setFilterAndFetch,
    addToCart,
  } = useCartStore();

  const [activeTab, setActiveTab] = useState("all");

  // Caricamento iniziale
  useEffect(() => {
    // Se abbiamo solo i prodotti locali e non abbiamo ancora provato a scaricare nulla
    if (activeTab === "all" && status === "idle") {
      fetchApiProducts("all");
    }
  }, [activeTab, status, fetchApiProducts]);

  // Gestione cambio Tab (Dinamico nello store)
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setFilterAndFetch(tab);
  };

  // Caricamento altri prodotti (Paginazione)
  const handleLoadMore = () => {
    fetchApiProducts(activeTab);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header & Filtri */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Explore{" "}
              <Sparkles className="text-indigo-500 fill-indigo-500 w-8 h-8" />
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Discover our latest arrivals
            </p>
          </div>

          <nav className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 w-fit">
            {["all", "clothing", "accessories"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </header>

        {/* Griglia Prodotti */}
        {status === "loading" && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-600" />
            <p className="font-bold">Gathering products...</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {items.map((item) => (
              <article
                key={item.id}
                className="group bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
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
                <div className="p-6">
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

                  <button
                    onClick={() => addToCart(item.id)}
                    className="w-full bg-slate-50 hover:bg-indigo-600 text-slate-900 hover:text-white py-3.5 rounded-2xl font-bold text-sm transition-colors flex items-center justify-center gap-2 group/btn"
                  >
                    <ShoppingBag className="w-4 h-4 group-hover/btn:animate-bounce" />
                    Add to cart
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* Load More Section */}
        {hasMore && (
          <div className="mt-16 flex flex-col items-center">
            <button
              onClick={handleLoadMore}
              disabled={status === "loading"}
              className="px-10 py-4 bg-white border-2 border-slate-200 text-slate-900 font-black rounded-2xl hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              {status === "loading" ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading...
                </span>
              ) : (
                "Show more products"
              )}
            </button>
            <p className="text-slate-400 text-[10px] mt-4 font-bold uppercase tracking-[0.2em]">
              Currently displaying {items.length} items
              {/* TODO: aggiungere numero elementi/totale. valido quando si aggiungerà la ricerca per categoria all'API */}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
