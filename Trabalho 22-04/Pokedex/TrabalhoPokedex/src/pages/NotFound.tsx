import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <h2>Página não encontrada</h2>
      <p>Ops! A página que você está procurando não existe.</p>
      <img 
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png" 
        alt="Psyduck confuso" 
        className="psyduck-image"
      />
      <Link to="/" className="home-button">
        Voltar para Home
      </Link>
    </div>
  );
};

export default NotFound;
