// frontend/src/services/api.ts
import axios from 'axios';
// Certifique-se de que o caminho para 'Types' está correto e que 'Address' é exportado de lá
import type { Product, Address, User } from '../components/Types/index'; // Importe os tipos, incluindo Address e User se precisar

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

// ==============================================================================
// ADICIONE A FUNÇÃO 'updateUserData' AQUI!
// ==============================================================================

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

// ... adicione mais funções se precisar de outras operações CRUD ou filtros