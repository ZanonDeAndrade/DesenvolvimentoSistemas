// frontend/src/types/index.ts (ou types.ts)

// ===============================================
// Interfaces de Produto (Existente, com pequenas melhorias)
// ===============================================

// Usamos 'Product' como um tipo mais genérico para os itens retornados do backend
export interface Product {
  _id: string; // Adicionado: o ID do MongoDB
  id?: number;  // Tornando opcional, se o _id é o principal e o id original é mais para legacy/dados iniciais
  name: string;
  description?: string; // Tornando opcional, pois nem todos podem ter ou vir vazio
  price: number;
  originalPrice?: number; // Opcional, se houver promoção
  image: string; // Caminho/URL da imagem
  // A categoria agora tem uma união de literais que são as categorias reais
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
  originalPrice?: number; // Permanece opcional para flexibilidade
  details: string[]; // Combos geralmente sempre têm detalhes
}

export interface BebidaProduct extends Product {
  category: 'bebidas';
  volume: string; // Bebidas sempre têm volume
  details?: string[]; // Pode ter, mas não é obrigatório
}

export interface SushiItemProduct extends Product {
  // A categoria aqui está correta para os tipos específicos de sushi
  category: 'sashimi' | 'uramaki' | 'hot' | 'temaki';
  details: string[]; // Itens de sushi geralmente têm detalhes (ingredientes, peças)
}


// Sua interface para as abas de categoria (provavelmente permanece a mesma)
export interface CategoryTab {
  id: string;
  name: string;
  icon: string;
}

// ===============================================
// Novas Interfaces para Endereço e Usuário
// ===============================================

/**
 * Interface para o subdocumento de endereço do usuário.
 * Os campos são opcionais aqui se eles forem opcionalmente preenchidos no frontend,
 * mas devem refletir a tipagem e os nomes dos campos do seu Schema no backend.
 *
 * Ex: `rua` no frontend corresponde a `rua` no backend.
 */
export interface Address {
  rua: string;
  numero: string;
  complemento?: string; // Opcional no frontend e no backend
  bairro: string;
  cidade: string;
  estado: string; // Adicionado para corresponder ao backend
  cep: string;
}

/**
 * Interface para o modelo de usuário.
 * Os campos devem refletir a tipagem e os nomes dos campos do seu Schema no backend.
 *
 * Nota: 'senha' geralmente não é incluída ao enviar dados do backend para o frontend por segurança,
 * mas pode ser presente em requisições de login/registro.
 */
export interface User {
  _id: string; // ID gerado pelo MongoDB
  nome: string;
  email: string;
  telefone: string;
  endereco?: Address; // O subdocumento de endereço, opcional (se no seu schema for `required: false` para o objeto `endereco`)
  // createdAt?: string; // Opcional: Se seu schema Mongoose tiver timestamps
  // updatedAt?: string; // Opcional: Se seu schema Mongoose tiver timestamps
}


export interface PaymentMethod {
  type: 'credit' | 'debit' | 'pix' | 'cash';
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCVV?: string;
  cashChange?: number;
}