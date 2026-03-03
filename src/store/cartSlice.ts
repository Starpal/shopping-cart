import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PRODUCTS } from "../data";

import type { CartState } from "../types";

const initialState: CartState = {
  items: PRODUCTS,
  addedItems: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /**
     * Adds an item to the cart or increments its quantity
     */
    addToCart: (state, action: PayloadAction<number>) => {
      const product = state.items.find((item) => item.id === action.payload);
      const existingInCart = state.addedItems.find((item) => item.id === action.payload);

      if (product) {
        if (existingInCart) {
          // IMPORTANT: Update the object inside addedItems
          existingInCart.quantity = (existingInCart.quantity || 0) + 1;
        } else {
          // Push a copy of the product with quantity 1
          state.addedItems.push({ ...product, quantity: 1 });
        }
        state.total += product.price;
      }
    },

    /**
     * Removes an item completely from the cart
     */
    removeItem: (state, action: PayloadAction<number>) => {
      const itemToRemove = state.addedItems.find((item) => item.id === action.payload);
      
      if (itemToRemove) {
        state.total -= itemToRemove.price * (itemToRemove.quantity || 1);
        state.addedItems = state.addedItems.filter((item) => item.id !== action.payload);
      }
    },

    /**
     * Increments quantity of an item already in the cart
     */
    addQuantity: (state, action: PayloadAction<number>) => {
      const itemInCart = state.addedItems.find((item) => item.id === action.payload);
      
      if (itemInCart) {
        itemInCart.quantity = (itemInCart.quantity || 0) + 1;
        state.total += itemInCart.price;
      }
    },

    /**
     * Decrements quantity or removes the item if quantity hits 0
     */
    subtractQuantity: (state, action: PayloadAction<number>) => {
      const itemInCart = state.addedItems.find((item) => item.id === action.payload);

      if (itemInCart && itemInCart.quantity) {
        if (itemInCart.quantity > 1) {
          itemInCart.quantity -= 1;
          state.total -= itemInCart.price;
        } else {
          // If quantity is 1, remove the item entirely
          state.addedItems = state.addedItems.filter((item) => item.id !== action.payload);
          state.total -= itemInCart.price;
        }
      }
    },

    /**
     * Adjusts total for express shipping
     */
    addShipping: (state) => {
      state.total += 6;
    },

    subShipping: (state) => {
      state.total -= 6;
    },
  },
});

export const {
  addToCart,
  removeItem,
  addQuantity,
  subtractQuantity,
  addShipping,
  subShipping,
} = cartSlice.actions;

export default cartSlice.reducer;