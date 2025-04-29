import { useState, useEffect } from 'react';
import { PokemonBasic, PokemonListResponse } from '../types';
import PokemonCard from '../components/PokemonCard';
import './PokemonList.css';

const PokemonList = () => {
  const [pokemons, setPokemons] = useState<PokemonBasic[]>([]);
  const [filteredPokemons, setFilteredPokemons] = useState<PokemonBasic[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
        
        if (!response.ok) {
          throw new Error('Não foi possível buscar os Pokémons');
        }
        
        const data: PokemonListResponse = await response.json();
        setPokemons(data.results);
        setFilteredPokemons(data.results);
        setIsLoading(false);
      } catch (err) {
        setError('Erro ao carregar os Pokémons. Tente novamente mais tarde.');
        setIsLoading(false);
        console.error('Erro:', err);
      }
    };

    fetchPokemons();
  }, []);

  useEffect(() => {
    // Filtrar Pokémons com base no termo de busca
    const results = pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPokemons(results);
  }, [searchTerm, pokemons]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (isLoading) {
    return <div className="loading">Carregando Pokémons...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="pokemon-list-container">
      <h1>Lista de Pokémons</h1>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar Pokémon por nome..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      
      {filteredPokemons.length === 0 ? (
        <p className="no-results">Nenhum Pokémon encontrado com este nome.</p>
      ) : (
        <div className="pokemon-grid">
          {filteredPokemons.map((pokemon) => (
            <PokemonCard key={pokemon.name} pokemon={pokemon} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PokemonList;
