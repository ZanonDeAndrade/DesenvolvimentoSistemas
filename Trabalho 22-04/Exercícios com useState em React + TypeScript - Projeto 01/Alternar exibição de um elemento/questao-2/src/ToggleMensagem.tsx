import React, { useState } from 'react';

const ToggleMensagem: React.FC = () => {
  // Estado booleano que controla se a mensagem está visível ou não
  const [visivel, setVisivel] = useState<boolean>(false);

  return (
    <div>
      <button onClick={() => setVisivel(!visivel)}>
        {visivel ? 'Ocultar' : 'Mostrar'}
      </button>
      {/* Condicional que renderiza a mensagem se 'visivel' for true */}
      {visivel && <p>Olá, mundo!</p>}
    </div>
  );
};

export default ToggleMensagem;
