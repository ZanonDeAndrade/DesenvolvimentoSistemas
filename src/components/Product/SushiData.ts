
import type { SushiItem, CategoryTab } from '../Types/index';

export const categories: CategoryTab[] = [
  { id: 'combos', name: 'Combos', icon: '🍱' },
  { id: 'sashimi', name: 'Sashimi', icon: '🍣' },
  { id: 'temaki', name: 'Temaki', icon: '🌯' },
  { id: 'bebidas', name: 'Bebidas', icon: '🥤' }
];

export const sushiItems: SushiItem[] = [
  // COMBOS
  {
    id: 1,
    name: "COMBO PREMIUM",
    description: "52 peças variadas com salmão, atum e peixes especiais",
    price: 152.89,
    originalPrice: 158.90,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop&auto=format",
    category: "combos",
    details: [
      "4 sashimi de salmão;",
      "4 sashimi de peixe branco;",
      "8 uramaki skin especial;",
      "8 uramaki grelhado especial;",
      "6 uramaki filadélfia especial;",
      "4 joe (2 alho caramelizado, 2 maracujá);",
      "4 niguiri (2 peixe branco, 2 salmão);",
      "8 hosomaki pepino e camarão;",
      "6 hot roll (4 doritos, 4 sweet chilli);"
    ],
    points: 3822
  },
  {
    id: 2,
    name: "COMBO FAMÍLIA",
    description: "36 peças ideais para compartilhar",
    price: 89.90,
    image: "https://images.unsplash.com/photo-1582337129682-ba40be7a6b38?w=300&h=200&fit=crop&auto=format",
    category: "combos",
    details: [
      "6 sashimi de salmão;",
      "8 uramaki califórnia;",
      "8 uramaki filadélfia;",
      "6 hot roll especial;",
      "4 temaki de salmão;",
      "4 niguiri variados;"
    ],
    points: 2250
  },
  {
    id: 3,
    name: "COMBO EXECUTIVO",
    description: "20 peças perfeitas para o almoço",
    price: 52.90,
    image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=300&h=200&fit=crop&auto=format",
    category: "combos",
    details: [
      "4 sashimi de salmão;",
      "6 uramaki califórnia;",
      "4 hot roll;",
      "2 temaki de salmão;",
      "4 niguiri variados;"
    ],
    points: 1322
  },

  // SASHIMI
  {
    id: 4,
    name: "SASHIMI PREMIUM",
    description: "15 fatias dos melhores peixes frescos",
    price: 45.90,
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=300&h=200&fit=crop&auto=format",
    category: "sashimi",
    details: [
      "5 fatias de salmão fresco;",
      "5 fatias de atum;",
      "3 fatias de peixe branco;",
      "2 fatias de polvo;"
    ],
    points: 1147
  },
  {
    id: 5,
    name: "SASHIMI SALMÃO",
    description: "12 fatias de salmão fresco",
    price: 32.90,
    image: "https://images.unsplash.com/photo-1563612116625-3012372fccce?w=300&h=200&fit=crop&auto=format",
    category: "sashimi",
    details: [
      "12 fatias generosas de salmão fresco;",
      "Acompanha gengibre e wasabi;"
    ],
    points: 822
  },
  {
    id: 6,
    name: "SASHIMI ATUM",
    description: "10 fatias de atum fresco",
    price: 38.90,
    image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=300&h=200&fit=crop&auto=format",
    category: "sashimi",
    details: [
      "10 fatias de atum fresco;",
      "Acompanha gengibre e wasabi;"
    ],
    points: 972
  },

  // TEMAKI
  {
    id: 7,
    name: "TEMAKI SALMÃO GRELHADO",
    description: "Temaki com salmão grelhado e cream cheese",
    price: 18.50,
    image: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300&h=200&fit=crop&auto=format",
    category: "temaki",
    details: [
      "Salmão grelhado;",
      "Cream cheese;",
      "Pepino japonês;",
      "Cebolinha;"
    ],
    points: 462
  },
  {
    id: 8,
    name: "TEMAKI CAMARÃO",
    description: "Temaki crocante com camarão empanado",
    price: 16.90,
    image: "https://images.unsplash.com/photo-1579043070460-c3b8a6f79bbe?w=300&h=200&fit=crop&auto=format",
    category: "temaki",
    details: [
      "Camarão empanado;",
      "Maionese especial;",
      "Alface americana;",
      "Tomate cereja;"
    ],
    points: 422
  },
  {
    id: 9,
    name: "TEMAKI SKIN",
    description: "Temaki com pele de salmão crocante",
    price: 15.90,
    image: "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=300&h=200&fit=crop&auto=format",
    category: "temaki",
    details: [
      "Pele de salmão crocante;",
      "Cream cheese;",
      "Cebolinha;",
      "Gergelim;"
    ],
    points: 397
  },

  // BEBIDAS
  {
    id: 10,
    name: "REFRIGERANTE LATA",
    description: "Coca-Cola, Guaraná, Fanta - 350ml",
    price: 5.90,
    image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=300&h=200&fit=crop&auto=format",
    category: "bebidas",
    details: [
      "Coca-Cola;",
      "Guaraná Antarctica;",
      "Fanta Laranja;",
      "Sprite;"
    ],
    points: 147
  },
  {
    id: 11,
    name: "ÁGUA COM GÁS",
    description: "Água mineral com gás - 500ml",
    price: 4.50,
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop&auto=format",
    category: "bebidas",
    details: [
      "Água mineral com gás;",
      "500ml gelada;"
    ],
    points: 112
  },
  {
    id: 12,
    name: "SUCO NATURAL",
    description: "Suco natural de frutas - 400ml",
    price: 8.90,
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=300&h=200&fit=crop&auto=format",
    category: "bebidas",
    details: [
      "Laranja;",
      "Limão;",
      "Maracujá;",
      "Acerola;"
    ],
    points: 222
  }
];