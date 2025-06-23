// frontend/src/types/index.ts (ou types.ts)

// ===============================================
// Interfaces de Produto
// ===============================================

export interface Product {
  _id: string; // O ID do MongoDB
  id?: number;  // Opcional, se o _id é o principal
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'combos' | 'sashimi' | 'uramaki' | 'hot' | 'temaki' | 'bebidas';
  details?: string[];
  volume?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ComboProduct extends Product {
  category: 'combos';
  details: string[];
}

export interface BebidaProduct extends Product {
  category: 'bebidas';
  volume: string;
}

export interface SushiItemProduct extends Product {
  category: 'sashimi' | 'uramaki' | 'hot' | 'temaki';
  details: string[];
}

// Sua interface para as abas de categoria (se usada)
export interface CategoryTab {
  id: string;
  name: string;
  icon: string;
}

// ===============================================
// Interfaces de Endereço e Usuário
// ===============================================

export interface Address {
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface User {
  _id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco?: Address;
  createdAt?: string;
  updatedAt?: string;
}

// ===============================================
// Interfaces de Pagamento
// ===============================================

export interface PaymentMethod {
  type: 'credit' | 'debit' | 'pix' | 'cash';
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCVV?: string;
  cashChange?: number;
}

// ===============================================
// Interfaces de Integração com ViaCEP
// ===============================================

export interface ViaCepAddress {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string; // Cidade
  uf: string;        // Estado
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean; // A ViaCEP retorna esta propriedade se o CEP não for encontrado
}

// ===============================================
// NOVAS INTERFACES (AS QUE ESTAVAM FALTANDO NO SEU ARQUIVO)
// ===============================================

/**
 * Interface para um item dentro do carrinho no frontend.
 * Corresponde aos dados do produto mais a quantidade.
 */
export interface CartItem {
  id: string; // O _id do produto do MongoDB
  name: string;
  price: number;
  image: string;
  quantity: number;
}

/**
 * Interface para um item dentro de um pedido (no backend e frontend).
 * Reflete o que é salvo no modelo Order do Mongoose.
 */
export interface IOrderItem {
  productId: string; // Será o _id do produto no MongoDB
  name: string;
  price: number;
  image: string;
  quantity: number;
}

/**
 * Interface principal para o modelo de Pedido.
 * Reflete o esquema do Mongoose para Pedidos.
 */
export interface IOrder {
  _id: string; // ID do pedido no MongoDB
  userId: string; // ID do usuário que fez o pedido
  items: IOrderItem[]; // Lista de itens do pedido
  total: number; // Preço total do pedido (incluindo taxa de entrega)
  deliveryFee: number; // Taxa de entrega separada
  address: Address; // O endereço de entrega do pedido
  paymentMethod: PaymentMethod; // O método de pagamento usado
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; // Status do pedido
  orderIdCustom: string; // Um ID gerado no frontend ou um hash para referência
  timestamp: string; // Data e hora em que o pedido foi criado (string ISO 8601)
  createdAt?: string; // Se o Mongoose tiver timestamps (automaticamente adicionado)
  updatedAt?: string; // Se o Mongoose tiver timestamps (automaticamente adicionado)
}