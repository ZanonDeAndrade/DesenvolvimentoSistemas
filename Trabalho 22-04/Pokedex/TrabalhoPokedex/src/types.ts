export interface PokemonBasic {
    name: string;
    url: string;
  }
  
  export interface PokemonDetails {
    name: string;
    sprites: {
      front_default: string;
    };
    height: number;
    weight: number;
    abilities: {
      ability: { name: string };
    }[];
  }
  
  export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonBasic[];
  }
  