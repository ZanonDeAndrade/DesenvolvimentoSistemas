import { Link } from 'react-router-dom';
import { useState } from 'react';
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
    <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
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
  { code: '+1', flag: '🇺🇸',},
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
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowDropdown(false);
  };


  const validateFields = () => {
    if (!email.trim()) {
      alert('Por favor, preencha o campo Email');
      return false;
    }
    
    if (!password.trim()) {
      alert('Por favor, preencha o campo Senha');
      return false;
    }
    
    if (!phone.trim()) {
      alert('Por favor, preencha o campo Número');
      return false;
    }
    
    return true; 
  };



  return (
    <div className="CreateAccount-page">
      <div className='background-shapes'></div>
      <div className='login-container'>
        <h1>Criar Conta</h1>

        <div className='email-container'>
          <input type="email" 
          placeholder='Email' 
          className='input-field' 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className='password-container'>
          <input
            type={showPassword ? "text" : "password"}
            placeholder='Senha'
            className='input-field'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        
        <div className='phone-container'>
          <div className='country-selector'>
            <button
              type="button"
              className='country-button'
              onClick={() => setShowDropdown(!showDropdown)}
              aria-label="Selecionar país"
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
            onChange={(e) => setPhone(e.target.value)}
            pattern="[0-9]*"
          />
        </div>
        
        
        <Link 
          to="/Shop/Shop" 
          className="login-button"
          onClick={(e) => {
            if (!validateFields()) {
              e.preventDefault(); 
            }
          }}
        >
          Criar Conta
        </Link>
        <Link 
          to="/" 
          className="cancel-link">Cancelar
        </Link>

      </div>
    </div>
  );
};

export default CreateAccount;