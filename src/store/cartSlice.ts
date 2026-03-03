import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { PRODUCTS } from "../data";
import type { CartState, Item } from "../types";

// 1. Define a Thunk to load data from a real API (FakeStoreAPI)
export const fetchApiProducts = createAsyncThunk(
  "cart/fetchApiProducts",
  async () => {
    const response = await fetch("https://fakestoreapi.com/products");
    const data = await response.json();

    // Map API data to our Item format
    return data.map((product: any) => ({
      id: product.id + 100, // Offset IDs to avoid conflicts with local data
      title: product.title,
      desc: product.description,
      price: product.price,
      img: product.image,
      category: product.category, // Essential for filtering sections
    })) as Item[];
  },
);

interface ExtendedCartState extends CartState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ExtendedCartState = {
  items: PRODUCTS, // Start with local data
  addedItems: [],
  total: 0,
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<number>) => {
      const product = state.items.find((item) => item.id === action.payload);
      const existingInCart = state.addedItems.find(
        (item) => item.id === action.payload,
      );
      if (product) {
        if (existingInCart) {
          existingInCart.quantity = (existingInCart.quantity || 0) + 1;
        } else {
          state.addedItems.push({ ...product, quantity: 1 });
        }
        state.total += product.price;
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      const itemToRemove = state.addedItems.find(
        (item) => item.id === action.payload,
      );
      if (itemToRemove) {
        state.total -= itemToRemove.price * (itemToRemove.quantity || 1);
        state.addedItems = state.addedItems.filter(
          (item) => item.id !== action.payload,
        );
      }
    },
    addQuantity: (state, action: PayloadAction<number>) => {
      const itemInCart = state.addedItems.find(
        (item) => item.id === action.payload,
      );
      if (itemInCart) {
        itemInCart.quantity = (itemInCart.quantity || 0) + 1;
        state.total += itemInCart.price;
      }
    },
    subtractQuantity: (state, action: PayloadAction<number>) => {
      const itemInCart = state.addedItems.find(
        (item) => item.id === action.payload,
      );
      if (itemInCart && itemInCart.quantity) {
        if (itemInCart.quantity > 1) {
          itemInCart.quantity -= 1;
          state.total -= itemInCart.price;
        } else {
          state.addedItems = state.addedItems.filter(
            (item) => item.id !== action.payload,
          );
          state.total -= itemInCart.price;
        }
      }
    },
    addShipping: (state) => {
      state.total += 6;
    },
    subShipping: (state) => {
      state.total -= 6;
    },
    checkout: (state) => {
      state.addedItems = [];
      state.total = 0;
    }
  },
  // 2. Handle API results in extraReducers
  extraReducers: (builder) => {
    builder
      .addCase(fetchApiProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchApiProducts.fulfilled,
        (state, action: PayloadAction<Item[]>) => {
          state.status = "succeeded";
          // Merge local products with API products
          const apiItems = action.payload.filter(
            (apiItem) =>
              !state.items.find(
                (localItem) => localItem.title === apiItem.title,
              ),
          );
          state.items = [...PRODUCTS, ...apiItems];
        },
      )
      .addCase(fetchApiProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch products";
      });
  },
});

export const {
  addToCart,
  removeItem,
  addQuantity,
  subtractQuantity,
  addShipping,
  subShipping,
  checkout,
} = cartSlice.actions;

export default cartSlice.reducer;
