import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";


const UserList: React.FC = () => {
  const context = useContext(UserContext);

  
  if (!context) {
    return <div>Erro: Contexto não encontrado</div>;
  }

  const { users } = context;

  return (
    <div>
      <h2>Lista de Usuários</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
