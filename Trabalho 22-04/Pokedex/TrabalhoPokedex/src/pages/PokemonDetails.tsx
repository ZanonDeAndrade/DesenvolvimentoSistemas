import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PokemonDetails as PokemonDetailsType } from '../types';
import './PokemonDetails.css';

const PokemonDetails = () => {
  const { name } = useParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        
        if (!response.ok) {
          throw new Error('Pokémon não encontrado');
        }
        
        const data = await response.json();
        setPokemon(data);
        setIsLoading(false);
      } catch (err) {
        setError('Erro ao carregar detalhes do Pokémon. Tente novamente mais tarde.');
        setIsLoading(false);
        console.error('Erro:', err);
      }
    };

    if (name) {
      fetchPokemonDetails();
    }
  }, [name]);

  if (isLoading) {
    return <div className="loading">Carregando detalhes do Pokémon...</div>;
  }

  if (error || !pokemon) {
    return (
      <div className="error-container">
        <p className="error">{error || 'Pokémon não encontrado'}</p>
        <Link to="/pokemons" className="back-button">
          Voltar para a lista
        </Link>
      </div>
    );
  }

  return (
    <div className="pokemon-details-container">
      <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
      
      <div className="pokemon-details-card">
        <div className="pokemon-image-container">
          <img 
            src={pokemon.sprites.front_default} 
            alt={pokemon.name} 
            className="pokemon-detail-image" 
          />
        </div>
        
        <div className="pokemon-info">
          <div className="info-item">
            <span className="info-label">Altura:</span>
            <span className="info-value">{pokemon.height / 10} m</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Peso:</span>
            <span className="info-value">{pokemon.weight / 10} kg</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">Habilidades:</span>
            <ul className="abilities-list">
              {pokemon.abilities.map((ability, index) => (
                <li key={index} className="ability-item">
                  {ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      <Link to="/pokemons" className="back-button">
        Voltar para a lista
      </Link>
    </div>
  );
};

export default PokemonDetails;
