// frontend/src/services/api.ts
import axios from 'axios';
// Certifique-se de que o caminho para 'Types' está correto e que 'Address' é exportado de lá
// Importe os tipos que você já tinha e adicione ViaCepAddress, CartItem, PaymentMethod, IOrder, IOrderItem
import type { Product, Address, User, ViaCepAddress, PaymentMethod, IOrder, IOrderItem } from '../components/Types/index'; // AQUI ESTÁ O CAMINHO DA IMPORTAÇÃO.

const API_BASE_URL = 'http://localhost:5000'; // URL do seu backend

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get<Product[]>('/products');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

export const getCombos = async (): Promise<Product[]> => { // Pode tipar como Combo[] se quiser mais rigor
  try {
    const response = await api.get<Product[]>('/products/combos');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar combos:', error);
    throw error;
  }
};

export const getBebidas = async (): Promise<Product[]> => { // Pode tipar como Bebida[]
  try {
    const response = await api.get<Product[]>('/products/bebidas');
    return response.data;
  } catch (error) {
      console.error('Erro ao buscar bebidas:', error);
      throw error;
  }
};

export const getSushiItems = async (): Promise<Product[]> => { // Pode tipar como SushiItem[]
  try {
    const response = await api.get<Product[]>('/products/sushi-items');
    return response.data;
  } catch (error) {
      console.error('Erro ao buscar sushi items:', error);
      throw error;
  }
};

/**
 * Envia uma requisição PUT para atualizar os dados de um usuário,
 * especificamente o subdocumento de endereço.
 * @param userId O ID do usuário a ser atualizado.
 * @param data O objeto contendo o subdocumento 'endereco'.
 * @param token O token JWT de autenticação.
 * @returns Os dados do usuário atualizado.
 */
export const updateUserData = async (userId: string, data: { endereco: Address }, token: string): Promise<User> => {
  try {
    const response = await api.put<User>(`/users/${userId}/address`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar endereço do usuário ${userId}:`, error);
    throw error; // Rejoga o erro para ser tratado pelo componente que chamou
  }
};

/**
 * Busca dados de endereço completos a partir de um CEP usando a API ViaCEP.
 * @param cep O CEP a ser pesquisado (apenas dígitos).
 * @returns Um objeto ViaCepAddress com os dados do endereço, ou null se não for encontrado/erro.
 */
export const getAddressByCep = async (cep: string): Promise<ViaCepAddress | null> => {
  // Remover caracteres não numéricos do CEP
  const cleanCep = cep.replace(/\D/g, '');

  // Validação simples: CEP deve ter 8 dígitos
  if (cleanCep.length !== 8) {
    console.warn('CEP inválido. Deve conter 8 dígitos.');
    return null;
  }

  try {
    const response = await axios.get<ViaCepAddress>(`https://viacep.com.br/ws/${cleanCep}/json/`);

    // A ViaCEP retorna um objeto com 'erro: true' se o CEP não for encontrado
    if (response.data && (response.data as any).erro) { // Usar (response.data as any).erro para acessar a propriedade dinamicamente
      console.warn(`CEP ${cleanCep} não encontrado pela ViaCEP.`);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar endereço para o CEP ${cleanCep}:`, error);
    return null;
  }
};

// ==============================================================================
// FUNÇÕES PARA PEDIDOS (CREATE AND GET)
// ==============================================================================

// Função para CRIAR um pedido
export const createOrder = async (orderData: {
  userId: string;
  items: IOrderItem[]; // <--- MUDANÇA ESSENCIAL AQUI: DEVE SER IOrderItem[]
  total: number;
  deliveryFee: number;
  address: Address;
  paymentMethod: PaymentMethod;
  orderIdCustom: string;
}, token: string): Promise<IOrder> => {
  try {
    const response = await api.post<IOrder>('/orders', orderData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    throw error;
  }
};
