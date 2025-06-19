import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const EyeOpen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="#ccc" viewBox="0 0 24 24">
    <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
    <circle cx="12" cy="12" r="2.5"/>
  </svg>
);

const EyeClosed = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" fill="#ccc" viewBox="0 0 24 24">
    <path d="M12 6a9.77 9.77 0 0 1 8.7 5.3c-.75 1.15-2.2 3.2-4.7 4.1M2 2l20 20M4.3 5.2C2.6 7.2 1.3 9.7 1.3 9.7s4 7 10.7 7c2.2 0 4.15-.8 5.7-2.1M14.9 10.7a3.99 3.99 0 0 0-3.6-3.6M9.7 14.9l-5.3-5.3"/>
  </svg>
);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    try {
      const response = await axios.post('http://localhost:5000/auth/login', { email, senha });
      const { token } = response.data;

      localStorage.setItem('token', token); 
      navigate('/Shop/Shop'); 
    } catch (err) {
      setErro('Email ou senha inválidos');
    }
  };

  return (
    <div className="login-page">
      <div className='background-shapes'></div>
      <div className='login-container'>
        <h1>Login</h1>
        <p>Bom te ver de volta! <span>🍣</span></p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder='Email'
            className='input-field'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className='password-container'>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder='Senha' 
              className='input-field'
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <button 
              type="button" 
              className='show-password' 
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeClosed /> : <EyeOpen />}
            </button>
          </div>

          {erro && <p className="error-message">{erro}</p>}

          <button type="submit" className="login-button">Entrar</button>
        </form>

        <p className='forgot-password'>Esqueci minha senha</p>
        <a href="/" className="cancel-link">Cancelar</a>
      </div>
    </div>
  );
};

export default Login;
