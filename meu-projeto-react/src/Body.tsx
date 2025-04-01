// Body.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "./UserCard";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

const Body: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<User[]>("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro na requisição:", err);
        setError("Erro ao carregar os usuários.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main style={{ padding: "1rem" }}>
      <h2>Lista de Usuários</h2>
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </main>
  );
};

export default Body;
