import axios from 'axios';
import type { Product } from '../components/Types'; // Importe os tipos

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

// ... adicione mais funções se precisar de outras operações CRUD ou filtros