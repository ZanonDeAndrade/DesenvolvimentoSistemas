import React, { createContext, useState, useEffect, ReactNode} from "react";


interface User {
    id: number;
    name: string;
    email: string;
    address: {
      street: string;
      city: string;
    };
}

interface UserContextType{
    user: Users[];
}    

export const UserContext = createContext<UserContextType | undefined>(undefined);


interface UserProviderProps{
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
  
   
    useEffect(() => {
      const fetchUsers = async () => {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await response.json();
        setUsers(data);
      };
  
      fetchUsers();
    }, []);
  
    return (
      <UserContext.Provider value={{ users }}>
        {children}
      </UserContext.Provider>
    );
  };
