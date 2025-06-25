import { createContext, useContext, useReducer, useCallback } from 'react';
import type { ReactNode } from 'react';
// Importa Product e CartItem (já ajustado) do arquivo de tipos central
import type { Product } from '../Types/index';
import type { CartItem } from '../Types/index'; // Certifique-se que esta é a CartItem ajustada

// Definição dos tipos - REMOVEMOS A DUPLICAÇÃO DE CARTITEM AQUI!
// CartItem agora é importado diretamente de '../../types'
// interface CartItem extends SushiItemProduct { ... } // <<-- ESTA PARTE FOI REMOVIDA

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// ATENÇÃO: As ações agora usam 'id: string'
type CartAction =
  | { type: 'ADD_ITEM'; payload: { item: Product; quantity: number; notes?: string } } // Agora aceita 'Product' e 'notes'
  | { type: 'REMOVE_ITEM'; payload: { id: string } } // id é string
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } } // id é string
  | { type: 'CLEAR_CART' };


interface CartContextType {
  state: CartState;
  addItem: (item: Product, quantity: number, notes?: string) => void; // item é Product, observations é notes
  removeItem: (id: string) => void; // id é string
  updateQuantity: (id: string, quantity: number) => void; // id é string
  clearCart: () => void;
}

// Estado inicial do carrinho zerado
const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};


const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item, quantity, notes } = action.payload; // Agora 'notes'
      // ATENÇÃO AQUI: Usando item._id para comparação
      const existingItemIndex = state.items.findIndex(
        cartItem => cartItem.id === item._id && cartItem.notes === notes // Compara pelo _id e notes
      );

      let newItems: CartItem[];

      if (existingItemIndex > -1) {
        // Item já existe no carrinho, atualiza quantidade
        newItems = state.items.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        // Novo item no carrinho
        const newCartItem: CartItem = {
          id: item._id, // <<-- MUITO IMPORTANTE: Usar _id do Product
          name: item.name,
          price: item.price,
          image: item.image,
          quantity,
          notes, // Agora 'notes'
        };
        newItems = [...state.items, newCartItem];
      }

      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);


      return {
        items: newItems,
        total,
        itemCount,
      };
    }


    // Ação para remover um item do carrinho - id agora é string
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload.id);
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        total,
        itemCount,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload; // id agora é string
      
      if (quantity <= 0) {
        // Remove item se quantidade for 0 ou menor
        const newItems = state.items.filter(item => item.id !== id);
        const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

        return {
          items: newItems,
          total,
          itemCount,
        };
      }

      const newItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );

      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        total,
        itemCount,
      };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
};


const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Adiciona um item ao carrinho - item é Product, observations é notes
  const addItem = useCallback((item: Product, quantity: number, notes?: string) => {
    dispatch({ type: 'ADD_ITEM', payload: { item, quantity, notes } });
  }, []);


  // Remove um item do carrinho - id é string
  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  }, []);

  // Atualiza a quantidade de um item no carrinho - id é string
  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  // Limpa todo o carrinho
  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};


export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};