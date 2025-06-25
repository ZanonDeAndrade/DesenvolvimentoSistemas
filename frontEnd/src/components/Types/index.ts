// frontend/src/types/index.ts

// ===============================================
// Interfaces de Produto
// ===============================================

export interface Product {
  _id: string; // O ID do MongoDB - ESTE É O CAMPO QUE USAMOS PARA O CARRINHO/PEDIDO
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

export interface CategoryTab {
  id: string;
  name: string;
  icon: string;
}

// ===============================================
// Interfaces de Endereço e Usuário (CRÍTICO AQUI!)
// ===============================================

// ESTA É A DEFINIÇÃO CANÔNICA DE ENDEREÇO.
// Todos os outros lugares (backend, api.ts, outros componentes) devem respeitar esta estrutura.
export interface Address {
  rua: string;
  numero: string;
  complemento?: string; // Opcional
  bairro: string;
  cidade: string;
  estado: string; // <<-- ESSENCIAL! Deve estar presente na resposta do backend
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
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

// ===============================================
// Interfaces para Carrinho e Pedido
// ===============================================

export interface CartItem {
  id: string; // Corresponde a Product._id
  name: string;
  price: number;
  image: string;
  quantity: number;
  notes?: string;
}

export interface IItem {
  idProduto: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  observacoes?: string;
}

export interface IOrderPayload {
  idCliente: string;
  nomeCliente: string;
  enderecoEntrega: Address; // Garante que Address completa é enviada
  itens: IItem[];
  valorTotal: number;
  metodoPagamento: 'dinheiro' | 'pix' | 'cartao de credito' | 'cartao de debito';
  observacoesGerais?: string;
}

/**
 * Interface para o objeto de pedido retornado pelo backend (`IOrder`).
 * ESTA É A INTERFACE QUE O BACKEND DEVE RETORNAR PARA O PEDIDO.
 * A propriedade `enderecoEntrega` DEVE SER DO TIPO `Address` COMPLETO.
 */
export interface IOrder {
  _id: string; // ID do MongoDB
  idPedido: string; // UUID gerado pelo backend
  idCliente: string;
  nomeCliente: string;
  enderecoEntrega: Address; // <<-- AQUI! Deve ser `Address`, não `IFrontendEndereco`
  itens: IItem[];
  valorTotal: number;
  statusPedido: 'pendente' | 'confirmado' | 'em preparo' | 'a caminho' | 'entregue' | 'cancelado' | 'finalizado'; 
  metodoPagamento: 'dinheiro' | 'pix' | 'cartao de credito' | 'cartao de debito';
  observacoesGerais?: string;
  dataHoraCriacao: string;
  dataHoraAtualizacao: string;
  dataHoraEntregaEstimada?: string;
  dataHoraEntregue?: string;
  entregadorId?: string;
}