
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
    image: 'https://via.placeholder.com/300x200?text=Sushi',
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
    image: 'https://via.placeholder.com/300x200?text=Sushi',
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
    image: 'https://via.placeholder.com/300x200?text=Sushi',
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
    image: 'https://via.placeholder.com/300x200?text=Sushi',
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
    image: 'https://via.placeholder.com/300x200?text=Sushi',
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
    image: 'https://via.placeholder.com/300x200?text=Sushi',
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
    image: 'https://via.placeholder.com/300x200?text=Sushi',
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
    image: 'https://via.placeholder.com/300x200?text=Sushi',
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
    image: 'https://via.placeholder.com/300x200?text=Sushi',
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
    image: 'https://via.placeholder.com/300x200?text=Sushi',
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
    image: 'https://via.placeholder.com/300x200?text=Sushi',
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
    image: 'https://via.placeholder.com/300x200?text=Sushi',
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