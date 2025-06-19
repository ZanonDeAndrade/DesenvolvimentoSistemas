// backEnd/src/data.ts
import type { SushiItemData } from "./types";


export const sushiItems: SushiItemData[] = [
  // COMBOS
  {
    id: 1,
    name: "COMBO PREMIUM",
    description: "52 peças variadas com salmão, atum e peixes especiais",
    price: 152.89,
    originalPrice: 158.9,
    image: "assets/ComboPremium.jpeg", // Caminho como string
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
      "6 hot roll (4 doritos, 4 sweet chilli);",
    ],
  },
  {
    id: 2,
    name: "COMBO HOT",
    description: "25 peças ideais para quem ama o sabor do hot",
    price: 89.9,
    image: "assets/ComboHot.jpeg",
    category: "combos",
    details: [
      "15 Hot filadélfia (5 crispy couve, 5 doritos, 5 sweetchilli);",
      "5 Uramaki grelhado;",
      "2 Niguiri salmão selado;",
      "2 Joe salmão selado;",
    ],
  },
  {
    id: 3,
    name: "COMBO IMPERIAL",
    description: "20 peças perfeitas para o almoço",
    price: 52.9,
    image: "assets/ComboImperial.jpeg",
    category: "combos",
    details: [
      "4 Sashimi salmão - 4 Sashimi salmão trufado;",
      "2 Joe ágata - 2 Joe salmão - 2 Joe supremo - 2 Sophia 2.0;",
      "4 Uramaki Sakura - 4 Uramaki Filadéfia Especial;",
      "4 Uramaki Grelhado Especial - 4 uramaki Ebi (camarão empanado;)",
      "2 Niguiri salmão - 2 Niguiri mostarda e mel;",
      "2 Niguiri onion- 4 Hossomaki pepino e camarão",
    ],
  },
  {
    id: 4,
    name: "COMBO OSAKA",
    description: "20 peças perfeitas para a família",
    price: 52.9,
    image: "assets/ComboOsaka.jpeg",
    category: "combos",
    details: [
      "4 uramaki grelhado especial;",
      "5 Hossomaki pepino e camarão;",
      "4 hot roll;",
      "5 Hossomaki kani filadélfia;",
      "4 Uramaki filadélfia;",
      "2 Niguiri onion;",
    ],
  },

  //HOT
  {
    id: 5,
    name: "TRIO DORITOS",
    description: "30 peças de hot a sua escolha",
    price: 45.9,
    image: "assets/TrioHot.jpeg",
    category: "hot",
    details: ["Sabores a sua escolha!"],
  },

  {
    id: 6,
    name: "HOT DORITOS",
    description: "10 peças de hot doritos",
    price: 45.9,
    image: "assets/HotDoritos.jpeg",
    category: "hot",
    details: [
      "10 peças de enrolado de arroz, alga, salmão e creamchese empanado e frito, finalizado com creamcheese e Doritos;",
    ],
  },

  {
    id: 7,
    name: "HOT FILADÉLFIA",
    description: "10 peças de hot filadélfia",
    price: 45.9,
    image: "assets/HotFiladelfia.jpeg",
    category: "hot",
    details: [
      "10 peças de enrolado de arroz, alga, salmão e creamchese empanado e frito, finalizado com tarê;",
    ],
  },

  {
    id: 8,
    name: "HOT LEMON",
    description: "10 peças de hot lemon",
    price: 45.9,
    image: "assets/HotLemon.jpeg",
    category: "hot",
    details: ["10 peças de hot, cremacheese, fatia fina de limão e tarê."],
  },

  {
    id: 9,
    name: "HOT TATAKI",
    description: "10 peças de hot tataki",
    price: 45.9,
    image: "assets/HotTataki.jpeg",
    category: "hot",
    details: [
      "10 peças de hot coberto com salmão, finalizadas com tarê e cebolinha.",
    ],
  },

  // SASHIMI
  {
    id: 10,
    name: "SASHIMI SALMÃO",
    description: "8 laminas de salmão fresco",
    price: 45.9,
    image: "assets/SashimiSalmao.jpeg",
    category: "sashimi",
    details: ["Laminas de salmão fresca"],
  },

  {
    id: 11,
    name: "SASHIMI SALMÃO TRUFADO",
    description: "12 laminas de salmão fresco com trufas",
    price: 32.9,
    image: "assets/SashimiTrufado.jpeg",
    category: "sashimi",
    details: [
      "Laminas de salmão, finalizado com raspas de limão siciliano, flor de sal e azeite de trufas negras.",
    ],
  },

  {
    id: 12,
    name: "SASHIMI SELADO",
    description: "12 laminas de salmão maçaricado",
    price: 32.9,
    image: "assets/SashimiSelado.jpeg",
    category: "sashimi",
    details: [
      "12 Laminas de salmão maçaricado, finalizado com tarê e gergelim torrado.",
    ],
  },

  //URAMAKI
  {
    id: 13,
    name: "URAMAKI CAMARÃO",
    description: "10 peças de uramaki camarão",
    price: 32.9,
    image: "assets/UramakiCamarao.jpeg",
    category: "uramaki",
    details: [
      "10 peças de enrolado de arroz, alga, camarão cozido e creamcheese.",
    ],
  },
  {
    id: 14,
    name: "URAMAKI FILADÉLFIA ESPECIAL",
    description: "10 peças de uramaki filadélfia especial",
    price: 32.9,
    image: "assets/UramakiFiladelfia.jpeg",
    category: "uramaki",
    details: [
      "10 peças de enrolado de arroz, alga, salmão, creamcheese e gergelim coberto por uma lâmina de salmão.",
    ],
  },
  {
    id: 15,
    name: "URAMAKI FILADÉLFIA",
    description: "10 peças de uramaki filadélfia",
    price: 32.9,
    image: "assets/UramakiFiladelfia2.jpeg",
    category: "uramaki",
    details: [
      "10 peças de enrolado de arroz, alga, salmão, creamcheese e gergelim;",
    ],
  },
  {
    id: 16,
    name: "URAMAKI KEWPIE",
    description: "10 peças de uramaki kewpie",
    price: 32.9,
    image: "assets/UramakiKewpie.jpeg",
    category: "uramaki",
    details: [
      "10 peças de enrolado de arroz, alga, salmão, creamcheese, Maionese Kewpie, cebolinha e gergelim;",
    ],
  },
  {
    id: 17,
    name: "URAMAKI SKIN",
    description: "10 peças de uramaki skin",
    price: 32.9,
    image: "assets/UramakiSkin.jpeg",
    category: "uramaki",
    details: [
      "10 peças de enrolado de arroz e pele de salmão frita coberto por uma lâmina de salmão maçaricado, creamcheese, couve e tarê artesanal.",
    ],
  },

  // TEMAKI
  {
    id: 18,
    name: "TEMAKI SALMÃO GRELHADO",
    description: "Temaki com salmão grelhado e cream cheese",
    price: 18.5,
    image: "assets/TemakiGrelhado.jpeg",
    category: "temaki",
    details: [
      "Salmão grelhado;",
      "Cream cheese;",
      "Pepino japonês;",
      "Cebolinha;",
    ],
  },
  {
    id: 19,
    name: "TEMAKI CAMARÃO",
    description:
      "Cone de alga recheado com arroz, camarão cozido e creamcheese, finalizado com gergelim e cebolinha;",
    price: 16.9,
    image: "assets/TemakiCamarao.jpeg",
    category: "temaki",
    details: ["Camarão cozido;", "Maionese especial;", "Gergelim;", "Tarê;"],
  },
  {
    id: 20,
    name: "TEMAKI HOT",
    description:
      "Cone de alga recheado com arroz, salmão e creamcheese, empanado e frito finalizado com tarê, gergelim e cebolinha;",
    price: 15.9,
    image: "assets/TemakiHot.jpeg",
    category: "temaki",
    details: ["Temaki frito;", "Cream cheese;", "Cebolinha;", "Gergelim;"],
  },
  {
    id: 21,
    name: "TEMAKI FILADÉLFIA",
    description:
      "Cone de alga recheado com arroz, salmão e creamcheese, finalizado com gergelim e cebolinha;",
    price: 15.9,
    image: "assets/TemakiFiladelfia.jpeg",
    category: "temaki",
    details: [
      "Salmão cru, fresco;",
      "Cream cheese;",
      "Cebolinha;",
      "Gergelim;",
    ],
  },

  // BEBIDAS
  {
    id: 22,
    name: "COCA LATA",
    description: "Coca-Cola Zero - 350ml",
    price: 5.9,
    image: "assets/CocaZero.jpeg",
    category: "bebidas",
    details: ["Coca-Cola Zero;", "350ml gelada;"],
  },
  {
    id: 23,
    name: "PEPSI BLACK LATA",
    description: "Pepsi Black - 350ml",
    price: 5.9,
    image: "assets/PepsiBlack.jpeg",
    category: "bebidas",
    details: ["Pepsi Black;", "350ml gelada;"],
  },
  {
    id: 24,
    name: "ÁGUA COM GÁS",
    description: "Água mineral com gás - 500ml",
    price: 4.5,
    image: "assets/AguaCGas.jpeg",
    category: "bebidas",
    details: ["Água mineral com gás;", "500ml gelada;"],
  },
  {
    id: 25,
    name: "ÁGUA SEM GÁS",
    description: "Água mineral sem gás - 500ml",
    price: 4.5,
    image: "assets/AguaSGas.jpeg",
    category: "bebidas",
    details: ["Água mineral sem gás;", "500ml gelada;"],
  },
  {
    id: 26,
    name: "CERVEJA ",
    description: "Cerveja Corona - 330ml",
    price: 4.5,
    image: "assets/CervejaCorona.jpeg",
    category: "bebidas",
    details: ["Cerveja Corona;", "330ml gelada;"],
  },
];