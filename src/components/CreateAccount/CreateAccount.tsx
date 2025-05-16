import { Link } from 'react-router-dom';
import './Style.css';

const CreateAccount= () => {
  return (
    <div className="CreateAccount-container">
      <h1>Crie sua conta</h1>
        <Link to="/" className="explore-button">
          Cancelar
        </Link>
        <Link to="/Profile/Profile" className="explore-button">
          Criar conta
        </Link>

    </div>
  );
};

export default CreateAccount;
