export interface Item {
  id: number;
  title: string;
  desc: string;
  price: number;
  img: string;
  quantity?: number;
  category?: string;
}

export interface CartState {
  items: Item[];
  addedItems: Item[];
  total: number;
}