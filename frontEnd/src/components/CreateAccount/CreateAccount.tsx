import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateAccount.css';

interface Country {
  code: string;
  flag: string;
}

const EyeOpen = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    width="24"
    fill="#ccc"
    viewBox="0 0 24 24"
  >
    <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.76 0-5-2.24-5 s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
    <circle cx="12" cy="12" r="2.5"/>
  </svg>
);

const EyeClosed = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    width="24"
    fill="#ccc"
    viewBox="0 0 24 24"
  >
    <path d="M12 6a9.77 9.77 0 0 1 8.7 5.3c-.75 1.15-2.2 3.2-4.7 4.1M2 2l20 20M4.3 5.2C2.6 7.2 1.3 9.7 1.3 9.7s4 7 10.7 7c2.2 0 4.15-.8 5.7-2.1M14.9 10.7a3.99 3.99 0 0 0-3.6-3.6M9.7 14.9l-5.3-5.3"/>
  </svg>
);

const countries: Country[] = [
  { code: '+55', flag: '🇧🇷'},
  { code: '+1', flag: '🇺🇸'},
  { code: '+44', flag: '🇬🇧'},
  { code: '+33', flag: '🇫🇷'},
  { code: '+49', flag: '🇩🇪'},
  { code: '+39', flag: '🇮🇹'},
  { code: '+34', flag: '🇪🇸'},
  { code: '+351', flag: '🇵🇹'},
  { code: '+54', flag: '🇦🇷'},
  { code: '+52', flag: '🇲🇽'},
];

const CreateAccount = () => {
  const navigate = useNavigate();
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowDropdown(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setSuccessMessage(''); // Limpa mensagens de sucesso anteriores
    
    // Validar campos antes de enviar
    if (!validateFields()) {
      return;
    }

    setLoading(true);

    try {
      const userData = {
        nome: nome.trim(),
        email: email.trim(),
        senha: password,
        telefone: `${selectedCountry.code}${phone.trim()}`
      };

      const response = await axios.post('http://localhost:5000/auth/register', userData);
      
      if (response.data.success) {
        // --- AQUI É O BLOCO DO JWT ---
        // Se o backend retornar um token, salve-o no localStorage
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          console.log('Token JWT salvo no localStorage:', response.data.token); // Para depuração
        } else {
          console.warn('Registro bem-sucedido, mas nenhum token foi recebido do backend.');
        }
        // --- FIM DO BLOCO DO JWT ---

        setSuccessMessage(response.data.mensagem || 'Conta criada com sucesso!');

        setTimeout(() => {
          navigate('/Shop/Shop');
        }, 1000); // Redireciona após 1 segundos
      }
      
    } catch (err: any) {
      console.error('Erro ao criar conta no frontend:', err); // Log mais específico
      
      // Tratamento de erros aprimorado para capturar mensagens do backend
      if (err.response && err.response.data) {
        if (err.response.data.mensagem) { // Prioriza 'mensagem' do backend
          setErro(err.response.data.mensagem);
        } else if (err.response.data.message) { // Ou 'message'
          setErro(err.response.data.message);
        } else if (err.response.status === 400) {
          setErro('Dados inválidos. Verifique as informações e tente novamente.');
        } else if (err.response.status === 409) {
          setErro('Este email já está cadastrado.');
        } else {
          setErro('Erro ao criar conta. Tente novamente.');
        }
      } else {
        setErro('Erro de rede ou servidor. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para validar os campos
  const validateFields = () => {
    if (!nome.trim()) {
      setErro('Por favor, preencha o campo Nome');
      return false;
    }

    if (!email.trim()) {
      setErro('Por favor, preencha o campo Email');
      return false;
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErro('Por favor, insira um email válido');
      return false;
    }
    
    if (!password.trim()) {
      setErro('Por favor, preencha o campo Senha');
      return false;
    }

    // Validar força da senha
    if (password.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    
    if (!phone.trim()) {
      setErro('Por favor, preencha o campo Número');
      return false;
    }

    // Validar se o telefone contém apenas números
    if (!/^\d+$/.test(phone.trim())) {
      setErro('O número de telefone deve conter apenas dígitos');
      return false;
    }
    
    return true; 
  };

  return (
    <div className="CreateAccount-page">
      <div className='background-shapes'></div>
      <div className='login-container'>
        <h1>Criar Conta</h1>

        {erro && (
          <div className="error-message" style={{
            color: '#ff4444',
            backgroundColor: '#ffebee',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px',
            border: '1px solid #ffcdd2'
          }}>
            {erro}
          </div>
        )}


        {successMessage && (
          <div className="success-message" style={{
            color: '#4CAF50',
            backgroundColor: '#E8F5E9',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '15px',
            border: '1px solid #C8E6C9'
          }}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className='nome-container'>
            <input 
              type="text" 
              placeholder='Nome'
              className='input-field'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className='email-container'>
            <input 
              type="email" 
              placeholder='Email' 
              className='input-field' 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div className='password-container'>
            <input
              type={showPassword ? "text" : "password"}
              placeholder='Senha'
              className='input-field'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <button
              type="button"
              className='show-password'
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              disabled={loading}
            >
              {showPassword ? <EyeClosed /> : <EyeOpen />}
            </button>
          </div>

          <div className='phone-container'>
            <div className='country-selector'>
              <button
                type="button"
                className='country-button'
                onClick={() => setShowDropdown(!showDropdown)}
                aria-label="Selecionar país"
                disabled={loading}
              >
                <span className='flag'>{selectedCountry.flag}</span>
                <span className='country-code'>{selectedCountry.code}</span>
                <span className='dropdown-arrow'>▼</span>
              </button>
              
              {showDropdown && (
                <div className='country-dropdown'>
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      className={`country-option ${selectedCountry.code === country.code ? 'selected' : ''}`}
                      onClick={() => handleCountrySelect(country)}
                      disabled={loading}
                    >
                      <span className='flag'>{country.flag}</span>
                      <span className='country-info'>
                        <span className='country-code'>{country.code}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <input 
              type="tel" 
              placeholder='Seu número' 
              className='input-field phone-input' 
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              pattern="[0-9]*"
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
            style={{
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Criando Conta...' : 'Criar Conta'}
          </button>
        </form>
        
        <Link 
          to="/" 
          className="cancel-link"
          style={{
            pointerEvents: loading ? 'none' : 'auto',
            opacity: loading ? 0.6 : 1
          }}
        >
          Cancelar
        </Link>
      </div>
    </div>
  );
};

export default CreateAccount;