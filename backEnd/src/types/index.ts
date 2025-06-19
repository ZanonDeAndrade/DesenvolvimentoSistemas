// types/index.ts (Ou onde você armazena seus tipos globais)

// Para os itens de sushi do seu array inicial
export interface SushiItemData {
    id: number;
    name: string;
    description?: string; // Opcional, por isso o '?'
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    details?: string[];
  }
  
  // Interfaces para os documentos do Mongoose (incluem métodos do Mongoose)
  import { Document } from 'mongoose';
  
  export interface ICombo extends Document {
    id: number;
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: 'combos'; // Definir o tipo literal para a categoria
    details?: string[];
  }


  export interface ISushiItem extends Document {
    id: number;
    name: string;
    description?: string;
    price: number;
    image: string;
    category: 'sashimi' | 'uramaki' | 'hot' | 'temaki'; // Union Types para categorias específicas
    details?: string[];
  }
  
  export interface IBebida extends Document {
    id: number;
    name: string;
    description?: string;
    price: number;
    image: string;
    category: 'bebidas';
    volume?: string; // Campo específico para bebidas
  }



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