import React from "react";
import { UserProvider } from "./context/UserContext";
import UserList from "./components/UserList";
import UserDetails from "./components/UserDetails";

const App: React.FC = () => {
  return (
    <UserProvider>
      <div>
        <h1>Exemplo de Context API - Usuários</h1>
        <UserList />
        <UserDetails />
      </div>
    </UserProvider>
  );
};

export default App;
