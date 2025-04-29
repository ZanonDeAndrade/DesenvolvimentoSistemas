import React, { useState } from 'react';

const NomeUsuario: React.FC = () => {
  // Estado que guarda o nome digitado, tipado como string
  const [nome, setNome] = useState<string>('');

  return (
    <div>
      <input
        type="text"
        placeholder="Digite seu nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <p>Olá, {nome}</p>
    </div>
  );
};

export default NomeUsuario;
