import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { PRODUCTS } from "../data";
import type { Item } from "../types";

interface CartState {
  items: Item[]; // Catalogo prodotti
  addedItems: Item[]; // Prodotti nel carrello
  total: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;

  // Actions
  fetchApiProducts: () => Promise<void>;
  addToCart: (id: number) => void;
  removeItem: (id: number) => void;
  addQuantity: (id: number) => void;
  subtractQuantity: (id: number) => void;
  checkout: () => void;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        items: PRODUCTS,
        addedItems: [],
        total: 0,
        status: "idle",
        error: null,

        // 1. Fetch API Products (Sostituisce createAsyncThunk)
        fetchApiProducts: async () => {
          set({ status: "loading" });
          try {
            const response = await fetch("https://fakestoreapi.com/products");
            const data = await response.json();

            const apiItems: Item[] = data.map((product: any) => ({
              id: product.id + 100,
              title: product.title,
              desc: product.description,
              price: product.price,
              img: product.image,
              category: product.category,
            }));

            // Logica di merge
            const currentItems = get().items;
            const newUniqueItems = apiItems.filter(
              (apiItem) =>
                !currentItems.find((local) => local.title === apiItem.title),
            );

            set({
              items: [...PRODUCTS, ...newUniqueItems],
              status: "succeeded",
            });
          } catch (error: any) {
            set({ status: "failed", error: error.message });
          }
        },

        // 2. Cart Logic (Sostituisce i Reducers)
        addToCart: (id) =>
          set((state) => {
            const product = state.items.find((i) => i.id === id);
            if (!product) return state;

            const existingInCart = state.addedItems.find((i) => i.id === id);
            let newAddedItems;

            if (existingInCart) {
              newAddedItems = state.addedItems.map((i) =>
                i.id === id ? { ...i, quantity: (i.quantity || 0) + 1 } : i,
              );
            } else {
              newAddedItems = [
                ...state.addedItems,
                { ...product, quantity: 1 },
              ];
            }

            return {
              addedItems: newAddedItems,
              total: state.total + product.price,
            };
          }),

        removeItem: (id) =>
          set((state) => {
            const itemToRemove = state.addedItems.find((i) => i.id === id);
            if (!itemToRemove) return state;

            return {
              addedItems: state.addedItems.filter((i) => i.id !== id),
              total:
                state.total - itemToRemove.price * (itemToRemove.quantity || 1),
            };
          }),

        addQuantity: (id) =>
          set((state) => {
            const item = state.addedItems.find((i) => i.id === id);
            if (!item) return state;

            return {
              addedItems: state.addedItems.map((i) =>
                i.id === id ? { ...i, quantity: (i.quantity || 0) + 1 } : i,
              ),
              total: state.total + item.price,
            };
          }),

        subtractQuantity: (id) => {
          set((state) => {
            const item = state.addedItems.find((i) => i.id === id);

            if (!item) return state;

            // If we have an item in the cart, we have at least quantity of 1.
            const currentQty = item.quantity ?? 1;

            if (currentQty > 1) {
              return {
                addedItems: state.addedItems.map((i) =>
                  i.id === id ? { ...i, quantity: currentQty - 1 } : i,
                ),
                total: state.total - item.price,
              };
            }

            return state;
          });
        },

        checkout: () => set({ addedItems: [], total: 0 }),
      }),
      {
        name: "shopping-cart-storage", // Nome della chiave in LocalStorage
        partialize: (state) => ({
          addedItems: state.addedItems,
          total: state.total,
        }), // Salviamo solo il carrello, non il catalogo intero
      },
    ),
  ),
);
