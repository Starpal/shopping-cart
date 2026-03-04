export interface Item {
  id: number;
  title: string;
  desc: string;
  price: number;
  img: string;
  category?: string;
  quantity?: number;
}

export interface CartState {
  items: Item[];
  addedItems: Item[];
  total: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  fetchApiProducts: () => Promise<void>;
  addToCart: (id: number) => void;
  removeItem: (id: number) => void;
  addQuantity: (id: number) => void;
  subtractQuantity: (id: number) => void;
  checkout: () => void;
}

export type CardFormData = {
  cardNumber: string;
  expiry: string;
  cvc: string;
};