import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Bem-vindo ao Catálogo de Pokémons!</h1>
      <p>
        Este é um catálogo simples onde você pode explorar diferentes Pokémons
        e descobrir mais sobre eles.
      </p>
      <div className="pokemon-image-container">
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
          alt="Pikachu"
          className="home-pokemon-image"
        />
      </div>
      <Link to="/pokemons" className="explore-button">
        Explorar Pokémons
      </Link>
    </div>
  );
};

export default Home;
