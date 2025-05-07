import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";


const UserDetails: React.FC = () => {
  const context = useContext(UserContext);

  if (!context) {
    return <div>Erro: Contexto não encontrado</div>;
  }

  const { users } = context;

  if (users.length === 0) return <p>Carregando...</p>;

  const user = users[0]; 

  return (
    <div>
      <h2>Detalhes do Usuário</h2>
      <p><strong>Nome:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Endereço:</strong> {user.address.street}, {user.address.city}</p>
    </div>
  );
};

export default UserDetails;
