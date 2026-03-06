import React, { useEffect, useState, useRef } from "react";
import { useCartStore } from "../store/useCartStore";
import { Loader2, Sparkles } from "lucide-react";
import ProductCard from "../components/ProductCard"; // Importa la card

const Home: React.FC = () => {
  const { items, status, hasMore, fetchApiProducts, setFilterAndFetch } = useCartStore();
  const [activeTab, setActiveTab] = useState("all");
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === "all" && status === "idle") {
      fetchApiProducts("all");
    }
  }, [activeTab, status, fetchApiProducts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && status !== "loading") {
          fetchApiProducts(activeTab);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore, status, activeTab, fetchApiProducts]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setFilterAndFetch(tab);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
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

        {/* Griglia Pulitissima */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </section>

        <div ref={observerTarget} className="mt-12 py-10 flex flex-col items-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Loading treasures...</p>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;