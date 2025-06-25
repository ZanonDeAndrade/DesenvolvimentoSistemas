import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { Address } from '../components/Types/index'; // Confirme o caminho para a sua interface Address

// Interface para o payload decodificado do token JWT
interface DecodedToken {
  userId: string;
  nome: string; // Confirme se o nome do campo é 'nome' ou 'name' no seu token JWT
  exp: number; // Timestamp de expiração
}

// Interface para o objeto de usuário armazenado no contexto
export interface User {
  _id: string; // O ID do usuário
  name: string; // O nome do usuário
  token: string; // O token JWT completo (agora obrigatório para um User logado no contexto)
  address?: Address; // Endereço do usuário (opcional)
}

// Interface para o contexto de autenticação
interface AuthContextType {
  user: User | null;
  login: (token: string, address?: Address) => void; // Login agora recebe apenas o token e, opcionalmente, o endereço
  logout: () => void;
  isLoading: boolean; // Indica se o AuthContext está carregando (verificando sessão no localStorage)
}

// Cria o contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provedor de autenticação que envolve a aplicação
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para carregar o usuário e token do localStorage na inicialização
  useEffect(() => {
    console.log("AUTH_CONTEXT: useEffect de inicialização. Verificando localStorage.");
    try {
      const storedToken = localStorage.getItem('token');
      const storedAddress = localStorage.getItem('userAddress'); // NOVO: Buscamos o endereço salvo separadamente

      if (storedToken) {
        try {
          const decodedToken: DecodedToken = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            console.warn("AUTH_CONTEXT: Token expirado no localStorage. Limpando sessão.");
            logout(); // Usa a função logout para limpar tudo de forma consistente
          } else {
            let addressFromStorage: Address | undefined;
            if (storedAddress) {
                try {
                    addressFromStorage = JSON.parse(storedAddress);
                } catch (e) {
                    console.error("AUTH_CONTEXT: Erro ao parsear address do localStorage:", e);
                    localStorage.removeItem('userAddress'); // Limpa se for inválido para evitar problemas futuros
                }
            }

            // Constrói o objeto User completo a partir do token decodificado e do endereço salvo
            const userFromStorage: User = {
              _id: decodedToken.userId,
              name: decodedToken.nome, // Use 'nome' ou 'name' dependendo do seu JWT
              token: storedToken,
              address: addressFromStorage // Adiciona o endereço salvo
            };
            setUser(userFromStorage);
            console.log("AUTH_CONTEXT: Usuário e token válidos encontrados no localStorage:", userFromStorage);
          }
        } catch (tokenError) {
          console.error("AUTH_CONTEXT: Erro ao decodificar token do localStorage ou token inválido:", tokenError);
          logout(); // Limpa a sessão se o token for inválido
        }
      } else {
        console.log("AUTH_CONTEXT: Nenhum token encontrado no localStorage.");
      }
    } catch (error) {
      console.error("AUTH_CONTEXT: Erro geral na inicialização do AuthContext:", error);
      logout(); // Em caso de qualquer erro, limpa a sessão
    } finally {
      setIsLoading(false); // Finaliza o estado de carregamento
      console.log("AUTH_CONTEXT: Inicialização concluída. isLoading = false.");
    }
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem do componente

  // Função para fazer login: recebe o token do backend e, opcionalmente, um endereço (se já veio com o login)
  const login = (token: string, addressFromLogin?: Address) => {
    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      const newUser: User = {
        _id: decodedToken.userId,
        name: decodedToken.nome, // Use 'nome' ou 'name' dependendo do seu JWT
        token: token,
        address: addressFromLogin // O endereço que veio da resposta do login (se houver)
      };
      setUser(newUser);
      localStorage.setItem('token', token); // Salva o token principal

      // Salva o endereço do usuário separadamente no localStorage
      if (addressFromLogin) {
          localStorage.setItem('userAddress', JSON.stringify(addressFromLogin));
      } else {
          localStorage.removeItem('userAddress'); // Garante que não haja lixo se não houver endereço
      }
      console.log("AUTH_CONTEXT: Função login chamada. Usuário definido e salvo:", newUser);
    } catch (error) {
      console.error("AUTH_CONTEXT: Erro no login ao decodificar token ou criar usuário:", error);
      logout(); // Em caso de erro, limpa a sessão
    }
  };

  // Função para fazer logout: limpa o estado e o localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userAddress'); // Limpa o endereço também
    console.log("AUTH_CONTEXT: Função logout chamada. Usuário, token e endereço limpos.");
  };

  // Fornece o estado e as funções para os componentes filhos
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};