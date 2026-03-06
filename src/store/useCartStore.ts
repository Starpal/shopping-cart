import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartState, Item } from "../types";
import { PRODUCTS } from "../data"; // I tuoi prodotti locali (es. 8 prodotti)

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: PRODUCTS, // Stato iniziale: prodotti locali subito visibili
      addedItems: [],
      total: 0,
      status: "idle",
      skip: 0,
      limit: 20,
      hasMore: true,

      fetchApiProducts: async (filter: string = "all") => {
        const { skip, items, status } = get();

        // Evitiamo fetch inutili se stiamo già caricando
        if (status === "loading") return;

        set({ status: "loading" });

        try {
          let fetchedProducts: any[] = [];
          let totalAvailable = 0;

          if (filter === "all") {
            // Calcolo: quanti ne mancano per arrivare a 20 al primo caricamento?
            // Se skip > 0, significa che stiamo già paginando oltre i primi 20.
            const isInitialLoad = skip === 0;
            const apiLimit = isInitialLoad ? 20 - PRODUCTS.length : 20;

            const response = await fetch(
              `https://dummyjson.com/products?limit=${apiLimit}&skip=${skip}&select=title,price,description,thumbnail,category`
            );
            const data = await response.json();
            fetchedProducts = data.products;
            totalAvailable = data.total;

            const mappedApiItems: Item[] = fetchedProducts.map((p: any) => ({
              id: p.id + 500, // Offset ID per non collidere con i locali
              title: p.title,
              desc: p.description,
              price: p.price,
              img: p.thumbnail,
              category: p.category,
            }));

            set({
              // Se è il primo caricamento, uniamo LOCALI + API
              // Altrimenti appendiamo agli items esistenti
              items: isInitialLoad 
                ? [...PRODUCTS, ...mappedApiItems] 
                : [...items, ...mappedApiItems],
              status: "succeeded",
              skip: skip + apiLimit,
              hasMore: data.total > skip + apiLimit,
            });

          } else {
            // LOGICA FILTRI (Clothing / Accessories)
            const categoryMap: Record<string, string[]> = {
              clothing: ["mens-shirts", "womens-dresses", "tops", "womens-tops", "mens-shoes"],
              accessories: ["watches", "jewelery", "sunglasses", "smartphones", "laptops"]
            };

            const categories = categoryMap[filter] || [];
            
            // Carichiamo in parallelo per popolare bene la tab
            const requests = categories.map(cat => 
              fetch(`https://dummyjson.com/products/category/${cat}?limit=10`).then(res => res.json())
            );
            
            const results = await Promise.all(requests);
            const apiFiltered = results.flatMap(r => r.products).map((p: any) => ({
              id: p.id + 2000,
              title: p.title,
              desc: p.description,
              price: p.price,
              img: p.thumbnail,
              category: p.category,
            }));

            set({
              items: apiFiltered,
              status: "succeeded",
              skip: apiFiltered.length,
              hasMore: false // Disattiviamo paginazione sui filtri per semplicità
            });
          }
        } catch (error) {
          console.error("Store Fetch Error:", error);
          set({ status: "failed" });
        }
      },

      setFilterAndFetch: async (filter: string) => {
        // Reset preventivo dello stato
        if (filter === "all") {
          set({ items: PRODUCTS, skip: 0, hasMore: true, status: "idle" });
        } else {
          set({ items: [], skip: 0, hasMore: true, status: "idle" });
        }
        // Eseguiamo la fetch mirata
        await get().fetchApiProducts(filter);
      },

      // --- LOGICA CARRELLO ---
      addToCart: (id: number) => {
        const { items, addedItems, total } = get();
        const itemToAdd = items.find((item) => item.id === id);
        if (!itemToAdd) return;

        const alreadyInCart = addedItems.find((item) => item.id === id);

        if (alreadyInCart) {
          set({
            addedItems: addedItems.map((item) =>
              item.id === id ? { ...item, quantity: (item.quantity ?? 0) + 1 } : item
            ),
            total: total + itemToAdd.price,
          });
        } else {
          set({
            addedItems: [...addedItems, { ...itemToAdd, quantity: 1 }],
            total: total + itemToAdd.price,
          });
        }
      },

      removeItem: (id: number) => {
        const itemToRemove = get().addedItems.find((item) => item.id === id);
        if (!itemToRemove) return;
        set((state) => ({
          addedItems: state.addedItems.filter((item) => item.id !== id),
          total: state.total - itemToRemove.price * (itemToRemove.quantity ?? 1),
        }));
      },

      addQuantity: (id: number) => {
        const item = get().addedItems.find((item) => item.id === id);
        if (!item) return;
        set((state) => ({
          addedItems: state.addedItems.map((i) =>
            i.id === id ? { ...i, quantity: (i.quantity ?? 0) + 1 } : i
          ),
          total: state.total + item.price,
        }));
      },

      subtractQuantity: (id: number) => {
        const item = get().addedItems.find((item) => item.id === id);
        if (!item) return;
        const currentQty = item.quantity ?? 1;
        if (currentQty > 1) {
          set((state) => ({
            addedItems: state.addedItems.map((i) =>
              i.id === id ? { ...i, quantity: currentQty - 1 } : i
            ),
            total: state.total - item.price,
          }));
        } else {
          get().removeItem(id);
        }
      },

      checkout: () => set({ addedItems: [], total: 0 }),
    }),
    {
      name: "cart-storage",
      // Persistiamo solo carrello e totale
      partialize: (state) => ({
        addedItems: state.addedItems,
        total: state.total,
      }),
    }
  )
);