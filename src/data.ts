import Item1 from "./images/item1.jpg";
import Item2 from "./images/item2.jpg";
import Item3 from "./images/item3.jpg"; 
import Item4 from "./images/item4.jpg";
import Item5 from "./images/item5.jpg";
import Item6 from "./images/item6.jpg";

import { Item } from "./types";

export const PRODUCTS: Item[] = [
    { id: 1, title: "Sneakers", desc: "Comfortable sneakers for everyday wear and occasion.", price: 110, img: Item1 },
    { id: 2, title: "Adidas", desc: "High-performance and premium running shoes.", price: 80, img: Item2 },
    { id: 3, title: "Vans", desc: "Classic skate shoes. Timeless Classic.", price: 120, img: Item3 },
    { id: 4, title: "Jordan", desc: "Iconic basketball shoes, perfect for any occasion.", price: 260, img: Item4 },
    { id: 5, title: "Nike", desc: "Designed for athletes, delivering everyday performance and comfort.", price: 160, img: Item5 },
    { id: 6, title: "New Balance", desc: "Durable casual shoes, ready for every terrain.", price: 90, img: Item6 },
  ]