import React, { useState } from 'react';

const Contador: React.FC = () => {
  // Estado que guarda o número atual do contador, tipado como number
  const [contador, setContador] = useState<number>(0);

  return (
    <div>
      <h2>Contador: {contador}</h2>
      {/* Botão para incrementar o valor */}
      <button onClick={() => setContador(contador + 1)}>+1</button>
      {/* Botão para decrementar o valor */}
      <button onClick={() => setContador(contador - 1)}>-1</button>
    </div>
  );
};

export default Contador;
