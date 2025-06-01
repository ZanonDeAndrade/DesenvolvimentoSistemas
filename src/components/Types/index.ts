//Tipagem para o arquivo SushiData

export interface SushiItem {
    id: number;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    details: string[];
  }
  
  export interface CategoryTab {
    id: string;
    name: string;
    icon: string;
  }