import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PokemonBasic } from '../types';
import './PokemonCard.css';

interface PokemonCardProps {
  pokemon: PokemonBasic;
}

const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Extrair o ID do Pokémon a partir da URL
    const getId = () => {
      const urlParts = pokemon.url.split('/');
      return urlParts[urlParts.length - 2];
    };

    // Obter a URL da imagem usando o ID
    const id = getId();
    setImageUrl(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`);
    setIsLoading(false);
  }, [pokemon.url]);

  return (
    <div className="pokemon-card">
      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <img src={imageUrl} alt={pokemon.name} className="pokemon-image" />
          <h3 className="pokemon-name">{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
          <Link to={`/pokemons/${pokemon.name}`} className="details-button">
            Ver detalhes
          </Link>
        </>
      )}
    </div>
  );
};

export default PokemonCard;
