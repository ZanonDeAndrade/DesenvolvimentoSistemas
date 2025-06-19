// frontend/src/types/index.ts (ou types.ts)

// Usamos 'Product' como um tipo mais genérico para os itens retornados do backend
export interface Product {
  _id: string; // Adicionado: o ID do MongoDB
  id: number;  // Seu ID original
  name: string;
  description?: string; // Tornando opcional, pois nem todos podem ter ou vir vazio
  price: number;
  originalPrice?: number; // Opcional
  image: string; // Caminho/URL da imagem
  category: 'combos' | 'sashimi' | 'uramaki' | 'hot' | 'temaki' | 'bebidas'; // Tipagem mais estrita
  details?: string[]; // Opcional, comum em combos e alguns sushis
  volume?: string;    // Opcional, específico para bebidas
  // Você pode adicionar outros campos que Mongoose pode incluir, como createdAt e updatedAt:
  // createdAt?: string; // Se você tiver timestamps habilitados no Mongoose
  // updatedAt?: string;
}

// Interfaces mais específicas (opcional, mas bom para clareza)
export interface ComboProduct extends Product {
  category: 'combos';
  originalPrice: number; // Combos geralmente têm, mas ainda pode ser opcional no schema do DB
  details: string[];
}

export interface BebidaProduct extends Product {
  category: 'bebidas';
  volume: string;
  details?: string[]; // Bebidas também podem ter detalhes, mas volume é o principal
}

export interface SushiItemProduct extends Product {
  category: 'sashimi' | 'uramaki' | 'hot' | 'temaki';
  details: string[];
}


// Sua interface para as abas de categoria (provavelmente permanece a mesma)
export interface CategoryTab {
  id: string;
  name: string;
  icon: string;
}