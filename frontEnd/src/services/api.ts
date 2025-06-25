// frontend/src/services/api.ts
import axios from 'axios';

// <<-- IMPORTANTE: Importe os tipos canônicos do seu arquivo central `types/index.ts`
import type {
  Product as IProduct, // Renomeado para evitar conflito com 'Product' de outras libs
  User,
  ViaCepAddress,
  Address,        // <<-- Usaremos esta para endereço
  IOrderPayload,  // <<-- Usaremos esta para o payload de criação de pedido
  IOrder          // <<-- Usaremos esta para a resposta do pedido (substituindo IOrderResponse)
} from '../components/Types/index'; // Caminho corrigido para a pasta 'types' (não 'components/Types/index')

// <<-- REMOVIDO: As interfaces IFrontendItem, IFrontendEndereco, ICreateOrderPayload e IOrderResponse
// <<-- FORAM REMOVIDAS DAQUI, POIS AGORA USAMOS AS DEFINIÇÕES CANÔNICAS DE `../types`

// --- CONFIGURAÇÃO DO AXIOS ---
const API_BASE_URL = 'http://localhost:5000'; // <<-- Confirmado: Sua porta é 5000

const api = axios.create({
  baseURL: API_BASE_URL,
});


// --- FUNÇÕES DE BUSCA DE PRODUTOS (MANTIDAS) ---
export const getProducts = async (): Promise<IProduct[]> => {
  try {
    const response = await api.get<IProduct[]>('/products');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

export const getCombos = async (): Promise<IProduct[]> => {
  try {
    const response = await api.get<IProduct[]>('/products/combos');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar combos:', error);
    throw error;
  }
};

export const getBebidas = async (): Promise<IProduct[]> => {
  try {
    const response = await api.get<IProduct[]>('/products/bebidas');
    return response.data;
  } catch (error) {
      console.error('Erro ao buscar bebidas:', error);
      throw error;
  }
};

export const getSushiItems = async (): Promise<IProduct[]> => {
  try {
    const response = await api.get<IProduct[]>('/products/sushi-items');
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
 * @param data O objeto contendo o subdocumento 'endereco' (do tipo Address).
 * @param token O token JWT de autenticação.
 * @returns Os dados do usuário atualizado.
 */
// <<-- ATENÇÃO: O tipo do `endereco` agora é `Address` do seu arquivo `types`
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
    throw error;
  }
};

/**
 * Busca dados de endereço completos a partir de um CEP usando a API ViaCEP.
 * @param cep O CEP a ser pesquisado (apenas dígitos).
 * @returns Um objeto ViaCepAddress com os dados do endereço, ou null se não for encontrado/erro.
 */
export const getAddressByCep = async (cep: string): Promise<ViaCepAddress | null> => {
  const cleanCep = cep.replace(/\D/g, '');

  if (cleanCep.length !== 8) {
    console.warn('CEP inválido. Deve conter 8 dígitos.');
    return null;
  }

  try {
    const response = await axios.get<ViaCepAddress>(`https://viacep.com.br/ws/${cleanCep}/json/`);

    if (response.data && (response.data as any).erro) {
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
// FUNÇÕES PARA PEDIDOS (AGORA USANDO OS TIPOS CANÔNICOS)
// ==============================================================================

/**
 * Envia um novo pedido para o backend.
 * @param orderData Os dados do pedido, conforme esperado pelo backend (do tipo IOrderPayload).
 * @param token O token JWT de autenticação do usuário.
 * @returns O objeto do pedido criado, retornado pelo backend (do tipo IOrder).
 */
// <<-- ATENÇÃO: O payload agora é IOrderPayload e o retorno é IOrder
export const createOrder = async (orderData: IOrderPayload, token?: string): Promise<IOrder> => {
  try {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.warn("Nenhum token fornecido para criar o pedido. A rota pode exigir autenticação.");
    }

    // <<-- O Axios vai tentar mapear a resposta para IOrder.
    // <<-- O BACKEND DEVE RETORNAR UM OBJETO QUE SE ENCAIXE EM IOrder (com Address completo)
    const response = await api.post<IOrder>('/orders', orderData, { headers });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    throw error;
  }
};

// Exemplo: Função para buscar pedidos do usuário (você pode adicionar filtros, etc.)
// <<-- ATENÇÃO: O retorno agora é Promise<IOrder[]>
export const getOrdersByUserId = async (userId: string, token: string): Promise<IOrder[]> => {
  try {
    const response = await api.get<IOrder[]>(`/orders?idCliente=${userId}`, { // Exemplo de filtro por idCliente
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar pedidos do usuário ${userId}:`, error);
    throw error;
  }
};


export default api;