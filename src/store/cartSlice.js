import { createSlice } from "@reduxjs/toolkit";
import Item1 from "../images/item1.jpg";
import Item2 from "../images/item2.jpg";
import Item3 from "../images/item3.jpg";
import Item4 from "../images/item4.jpg";
import Item5 from "../images/item5.jpg";
import Item6 from "../images/item6.jpg";

const initialState = {
  items: [
    {
      id: 1,
      title: "Winter body",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, ex.",
      price: 110,
      img: Item1,
    },
    {
      id: 2,
      title: "Adidas",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, ex.",
      price: 80,
      img: Item2,
    },
    {
      id: 3,
      title: "Vans",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, ex.",
      price: 120,
      img: Item3,
    },
    {
      id: 4,
      title: "White",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, ex.",
      price: 260,
      img: Item4,
    },
    {
      id: 5,
      title: "Cropped-sho",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, ex.",
      price: 160,
      img: Item5,
    },
    {
      id: 6,
      title: "Blues",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima, ex.",
      price: 90,
      img: Item6,
    },
  ],
  addedItems: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      let addedItem = state.items.find((item) => item.id === action.payload);
      let existed_item = state.addedItems.find(
        (item) => action.payload === item.id,
      );

      if (existed_item) {
        addedItem.quantity += 1;
        state.total = state.total + addedItem.price;
      } else {
        addedItem.quantity = 1;
        let newTotal = state.total + addedItem.price;
        state.addedItems.push(addedItem);
        state.total = newTotal;
      }
    },
    removeItem: (state, action) => {
      let itemToRemove = state.addedItems.find(
        (item) => action.payload === item.id,
      );
      state.addedItems = state.addedItems.filter(
        (item) => action.payload !== item.id,
      );
      state.total = state.total - itemToRemove.price * itemToRemove.quantity;
    },
    addQuantity: (state, action) => {
      let addedItem = state.items.find((item) => item.id === action.payload);
      addedItem.quantity += 1;
      state.total = state.total + addedItem.price;
    },
    subtractQuantity: (state, action) => {
      let addedItem = state.items.find((item) => item.id === action.payload);
      if (addedItem.quantity === 1) {
        state.addedItems = state.addedItems.filter(
          (item) => item.id !== action.payload,
        );
        state.total = state.total - addedItem.price;
      } else {
        addedItem.quantity -= 1;
        state.total = state.total - addedItem.price;
      }
    },
    addShipping: (state) => {
      state.total = state.total + 6;
    },
    subShipping: (state) => {
      state.total = state.total - 6;
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
