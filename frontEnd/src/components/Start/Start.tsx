import { Link } from 'react-router-dom';
import './Start.css';
import Logo from './Logo.png'

const Start= () => {
  return (
    <div className="home-container">
      <img src={Logo} alt="Logo"/>
      <h1 className='agape'>AKAY SUSHI</h1>
      <p>Descubra o sabor do Japão sem sair de casa. Peça seu sushi fresco, rápido e com qualidade garantida!</p>
        <Link to="./Login/Login" className="login-button">
          Fazer login.
        </Link>
        <Link to="/CreateAccount/CreateAccount" className="create-account-button">
          Criar conta.
        </Link>
    </div>
  );
};

export default Start;
