import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";

// 1. Combine reducers first to create a clear RootReducer type
const rootReducer = combineReducers({
  cart: cartReducer,
});

// 2. Load and validate state from LocalStorage
const loadFromLocalStorage = () => {
  try {
    const serializedItems = localStorage.getItem("cartItems");
    const serializedTotal = localStorage.getItem("cartTotal");
    
    if (serializedItems === null) return undefined;

    // We return a partial state that matches the RootState structure
    return {
      cart: {
        // We spread the initial state to ensure 'items' (the product list) is always there
        // as we only save 'addedItems' and 'total'
        addedItems: JSON.parse(serializedItems),
        total: JSON.parse(serializedTotal || "0"),
        items: [] // This will be merged with the slice's initial state if handled correctly
      }
    };
  } catch (e) {
    console.warn("Could not load state", e);
    return undefined;
  }
};

// 3. Configure the store
export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadFromLocalStorage(),
});

// 4. Persistence Subscription
store.subscribe(() => {
  const state = store.getState();
  try {
    localStorage.setItem("cartItems", JSON.stringify(state.cart.addedItems));
    localStorage.setItem("cartTotal", JSON.stringify(state.cart.total));
  } catch (e) {
    console.error("Error saving state", e);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;