export interface SushiItem {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    details: string[];
    points?: number;
  }
  
  export interface CategoryTab {
    id: string;
    name: string;
    icon: string;
  }