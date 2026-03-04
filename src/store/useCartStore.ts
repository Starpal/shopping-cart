import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Item, CartState } from '../types';
import { PRODUCTS } from '../data';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: PRODUCTS,
      addedItems: [],
      total: 0,
      status: 'idle',

      // 1. FETCH PRODOTTI DALL'API
      fetchApiProducts: async () => {
        // Ottimizzazione: non ricaricare se i dati ci sono già
       if (get().items.length > PRODUCTS.length) return;

        set({ status: 'loading' });

        try {
          const response = await fetch("https://fakestoreapi.com/products");
          const data = await response.json();

          const apiItems = data.map((product: any) => ({
            id: product.id + 100, // Offset per evitare conflitti con eventuali dati locali
            title: product.title,
            desc: product.description,
            price: product.price,
            img: product.image,
            category: product.category,
          })) as Item[];

          set({ items: [...PRODUCTS, ...apiItems], status: 'succeeded' });
        } catch (error) {
          console.error("Fetch error:", error);
          set({ status: 'failed' });
        }
      },

      // 2. AGGIUNGI AL CARRELLO
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
            total: total + itemToAdd.price
          });
        } else {
          set({
            addedItems: [...addedItems, { ...itemToAdd, quantity: 1 }],
            total: total + itemToAdd.price
          });
        }
      },

      // 3. RIMUOVI ELEMENTO COMPLETAMENTE
      removeItem: (id: number) => {
        const itemToRemove = get().addedItems.find((item) => item.id === id);
        if (!itemToRemove) return;

        set((state) => ({
          addedItems: state.addedItems.filter((item) => item.id !== id),
          total: state.total - (itemToRemove.price * (itemToRemove.quantity ?? 1))
        }));
      },

      // 4. AUMENTA QUANTITÀ (+1)
      addQuantity: (id: number) => {
        const item = get().addedItems.find((item) => item.id === id);
        if (!item) return;

        set((state) => ({
          addedItems: state.addedItems.map((i) =>
            i.id === id ? { ...i, quantity: (i.quantity ?? 0) + 1 } : i
          ),
          total: state.total + item.price
        }));
      },

      // 5. DIMINUISCI QUANTITÀ (-1) con AUTO-REMOVE
      subtractQuantity: (id: number) => {
        const item = get().addedItems.find((item) => item.id === id);
        if (!item) return;

        const currentQty = item.quantity ?? 1;

        if (currentQty > 1) {
          set((state) => ({
            addedItems: state.addedItems.map((i) =>
              i.id === id ? { ...i, quantity: currentQty - 1 } : i
            ),
            total: state.total - item.price
          }));
        } else {
          // Se la quantità è 1, rimuoviamo l'elemento
          get().removeItem(id);
        }
      },

      // 6. RESET CARRELLO (CHECKOUT SUCCESS)
      checkout: () => {
        set({ addedItems: [], total: 0 });
      }
    }),
    {
      name: 'cart-storage', // Nome della chiave in LocalStorage
      // Salviamo solo i prodotti aggiunti e il totale, non la lista intera della API
      partialize: (state) => ({ 
        addedItems: state.addedItems, 
        total: state.total 
      }),
    }
  )
);