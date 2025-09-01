export interface Game {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  isPopular: boolean;
  minTopUp: number;
  maxTopUp: number;
}

export interface TopUpOption {
  id: string;
  amount: number;
  price: number;
  bonus?: number;
  isPopular?: boolean;
}