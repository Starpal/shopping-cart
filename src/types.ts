// shared type definitions

export interface Item {
  id: number;
  title: string;
  desc: string;
  price: number;
  img: string;
  quantity?: number;
}

export interface CartState {
  items: Item[];
  addedItems: Item[];
  total: number;
}