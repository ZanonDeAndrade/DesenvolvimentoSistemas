# React com TypeScript e Vite

Vamos abordar o seguintes tópicos para estruturar nossa aula de React utilizando TypeScript e Vite:

**Introdução ao React**

- O que é React e qual a sua importância no desenvolvimento moderno
- História, popularidade e casos de uso
- Conceitos fundamentais: Virtual DOM, unidirecionalidade de dados e componentização

**Ambiente de Desenvolvimento**

- Instalação do Node.js e gerenciadores de pacotes (npm/yarn)
- O que é Vite e por que usá-lo para projetos React
- Introdução ao TypeScript e suas vantagens em projetos React

**Criação do Projeto com Vite e TypeScript**

- Passo a passo para inicializar um novo projeto com Vite
- Estrutura de pastas e arquivos gerados
- Configurações básicas e customizações iniciais

**Entendendo o JSX**

- Sintaxe e semântica do JSX
- Diferenças entre JSX e HTML tradicional
- Boas práticas ao escrever JSX

**Componentes em React**

- O que são componentes e como eles promovem a modularização
- Componentes funcionais (com hooks) versus componentes de classe (contextualizar a evolução)
- Conceitos de props e state para gerenciamento de dados internos e externos

**Construindo a Interface: Header, Body e Footer**

- Criando um componente Header: estrutura, estilização e funções comuns
- Criando um componente Footer: elementos e responsabilidades
- Criando um componente Body: composição, renderização condicional e organização de conteúdo
- Como organizar e compor esses componentes na aplicação principal

**Integração com API**

- Conceitos básicos de consumo de API (REST)
- Utilizando métodos como fetch ou bibliotecas como axios para chamadas assíncronas
- Gerenciamento dos dados retornados: carregamento, erro e sucesso
- Exibição dos dados na interface, com exemplos práticos

**Exercício Prático e Demonstração**

- Montagem de um mini-projeto que reúna todos os conceitos abordados
- Implementação dos componentes Header, Body e Footer
- Integração com uma API para exibir dados reais
- Debug e resolução de problemas comuns durante o desenvolvimento

**Boas Práticas e Próximos Passos**

- Organização e estruturação do código em projetos React
- Componentização e reutilização de código
- Recursos adicionais para aprofundamento (documentação, tutoriais e comunidades)
- Próximos passos para evolução: gerenciamento de estado, ciclo de vida e roteamento

## Introdução ao React

### O que é React?

React é uma biblioteca JavaScript criada pelo Facebook para a construção de interfaces de usuário. Ela se destaca pela criação de UIs baseadas em componentes, o que torna o desenvolvimento modular e reutilizável.

### Por que React é importante?

- Componentização: Permite quebrar a interface em pequenas partes reutilizáveis.
- Virtual DOM: React mantém uma representação em memória da UI e atualiza somente o que é necessário, aumentando a performance.
- Unidirecionalidade dos Dados: Os dados fluem de forma previsível (de componentes pais para filhos), facilitando o rastreamento e a depuração.

### JSX

JSX é uma sintaxe que permite escrever HTML dentro do JavaScript. Durante a compilação, o JSX é transformado em chamadas de função do React para criar elementos.

Exemplo de Código: Componente Funcional Simples em React com TypeScript

```tsx
// App.tsx
import React from "react";

// Declaração de um componente funcional utilizando tipagem do React (React.FC)
const App: React.FC = () => {
  const nome = "Felipe";
  return (
    <div>
      <h1>{`Olá ${nome}!`}</h1>
      <h2>Bem-vindo ao React com TypeScript!</h2>
      <p>Este é um exemplo simples de um componente funcional.</p>
    </div>
  );
};

export default App;
```

**O que está acontecendo neste código?**

- **Importação do React:** Necessário para usar JSX.
- **Componente Funcional:** App é declarado como uma função que retorna JSX.
- **Tipagem com TypeScript:** React.FC indica que o componente é um Functional Component, trazendo benefícios de tipagem estática e autocompletar.
- **Exportação do Componente:** Permite que ele seja utilizado em outras partes da aplicação.

## Ambiente de Desenvolvimento

### Node.js e Gerenciadores de Pacotes

Para desenvolver com React, é essencial ter o Node.js instalado. O Node.js permite utilizar o npm (ou yarn) para gerenciar dependências do projeto.

### Vite

Vite é uma ferramenta moderna de bundling que oferece um ambiente de desenvolvimento extremamente rápido, com recarregamento instantâneo.

**Vantagens do Vite**

- Tempo de inicialização rápido.
- Uso de ES Modules nativos.
- Configuração simples e flexível.

### TypeScript

TypeScript é uma linguagem baseada em JavaScript que adiciona tipagem estática, melhorando a qualidade do código e a experiência do desenvolvedor com funcionalidades como autocompletar e verificação de tipos.

### Exemplo de Criação de Projeto com Vite, React e TypeScript

**Instalar o Node.js:** Acesse nodejs.org e faça o download da versão LTS recomendada para o seu sistema operacional.

**Criar o Projeto com Vite:** No terminal, execute os seguintes comandos:

```bash

# Cria um novo projeto com template React + TypeScript

npm create vite@latest meu-projeto-react -- --template react-ts

# Acesse a pasta do projeto

cd meu-projeto-react

# Instale as dependências

npm install

# Inicie o servidor de desenvolvimento

npm run dev
```

### Estrutura Inicial do Projeto

Após a criação, o Vite gera uma estrutura com arquivos como:

- **index.html:** Ponto de entrada da aplicação.
- **src/main.tsx:** Onde o React é inicializado e renderizado no DOM.
- **src/App.tsx:** Exemplo de componente principal (como o que mostramos anteriormente).

**Exemplo do Arquivo src/main.tsx**

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Cria a raiz da aplicação e renderiza o componente App
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Pontos Importantes

- **Configuração Simples:** Vite já configura o ambiente para TypeScript e React, permitindo que você comece a desenvolver imediatamente.
- **Benefícios do TypeScript:** A utilização de TypeScript no projeto melhora a manutenção do código e evita muitos erros comuns durante o desenvolvimento.
- **Desenvolvimento Rápido:** Com Vite, o tempo de inicialização e a experiência de desenvolvimento são significativamente otimizados devido ao hot module replacement (HMR).

## Componentes em React

### O que são Componentes e sua Importância na Modularização

**Componentes:** São blocos de construção da interface, responsáveis por partes específicas da UI. Cada componente é autônomo e pode ser reutilizado em diferentes pontos da aplicação. Essa abordagem facilita a manutenção, o teste e a escalabilidade do projeto.

**Modularização:** Ao dividir a aplicação em componentes, você promove uma arquitetura mais organizada, onde cada parte tem responsabilidades bem definidas. Isso torna o código mais limpo e facilita a colaboração em equipes.

### Componentes Funcionais vs. Componentes de Classe

**Componentes Funcionais (com Hooks):**

São funções JavaScript que retornam JSX.

Com a introdução dos Hooks (como useState, useEffect etc.), esses componentes passaram a ser a abordagem padrão.

Vantagens: Sintaxe mais simples, menos boilerplate e melhor integração com a lógica de estado e efeitos colaterais.

**Componentes de Classe:**

Baseados em classes ES6 e utilizam métodos como render().

Antes dos Hooks, eram a principal forma de ter estado e lidar com ciclos de vida.

Hoje, são menos comuns, mas podem ser encontrados em projetos legados.

### Conceitos de Props e State

**Props:** São propriedades passadas de um componente pai para um componente filho. Elas são imutáveis e permitem a comunicação entre componentes.

**State:** É o estado interno de um componente. Diferente das props, o state pode ser alterado e afeta a renderização do componente.

**Exemplo simples de componente funcional utilizando props e state**

```tsx
// ExemploComponent.tsx
import React, { useState } from "react";

interface ExemploProps {
  mensagemInicial: string;
}

const ExemploComponent: React.FC<ExemploProps> = ({ mensagemInicial }) => {
  // Utilizando o hook useState para gerenciar o estado interno
  const [mensagem, setMensagem] = useState<string>(mensagemInicial);

  return (
    <div>
      <h2>{mensagem}</h2>
      <button onClick={() => setMensagem("Mensagem Atualizada!")}>
        Atualizar Mensagem
      </button>
    </div>
  );
};

export default ExemploComponent;
```

**Resumo**

- **Props:** Permitem a passagem de dados de um componente pai para filho.
- **State:** Gerencia dados internos que podem mudar com o tempo.

### Construindo a Interface: Header, Body e Footer

Nesta seção, vamos criar três componentes para estruturar a interface da aplicação: Header, Body e Footer.

**Componente Header**

O Header geralmente contém elementos como logotipo, menu de navegação e outros itens de cabeçalho.

```tsx
// Header.tsx
import React from "react";

const Header: React.FC = () => {
  return (
    <header style={{ backgroundColor: "#f0f0f0", padding: "1rem" }}>
      <h1>Meu Site</h1>
      <nav>
        <ul style={{ listStyle: "none", display: "flex", gap: "1rem" }}>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Sobre</a>
          </li>
          <li>
            <a href="#">Contato</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
```

**Componente Footer**

O Footer geralmente apresenta informações de copyright, links de interesse ou contato.

```tsx
// Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: "#f0f0f0",
        padding: "1rem",
        textAlign: "center",
      }}
    >
      <p>© 2025 Meu Site. Todos os direitos reservados.</p>
    </footer>
  );
};

export default Footer;
```

**Componente Body**

O Body é o conteúdo principal da aplicação. Aqui, vamos demonstrar também a renderização condicional e a organização dos dados.

```tsx
// Body.tsx
import React, { useEffect, useState } from "react";

// Definindo a interface para os dados que serão consumidos da API
interface Post {
  id: number;
  title: string;
  body: string;
}

const Body: React.FC = () => {
  // Estados para armazenar os dados, controlar o carregamento e erros
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Hook para consumir a API assim que o componente for montado
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar dados");
        }
        return response.json();
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Renderização condicional com base no estado
  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <main style={{ padding: "1rem" }}>
      <h2>Posts</h2>
      <ul>
        {posts.slice(0, 10).map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Body;
```

**Composição dos Componentes na Aplicação Principal**

No componente principal (geralmente o App.tsx), os componentes Header, Body e Footer são organizados para formar a estrutura completa da aplicação.

```tsx
// App.tsx
import React from "react";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";

const App: React.FC = () => {
  return (
    <div>
      <Header />
      <Body />
      <Footer />
    </div>
  );
};

export default App;
```

**Resumo da Seção**

- **Header:** Contém a estrutura de navegação e a identidade do site.
- **Body:** Exibe o conteúdo principal, incluindo dados dinâmicos consumidos de uma API com renderização condicional para carregamento e erros.
- **Footer:** Apresenta informações complementares e de copyright.

### Integração com API

**Conceitos Básicos de Consumo de API (REST)**

API REST: Conjunto de padrões que permite a comunicação entre aplicações via HTTP. As APIs REST geralmente retornam dados no formato JSON.

**Métodos**

- **GET:** Recupera dados.
- **POST:** Cria novos recursos.
- **PUT/PATCH:** Atualiza recursos existentes.
- **DELETE:** Remove recursos.

**Utilizando fetch para Chamadas Assíncronas**

No exemplo do componente Body acima, utilizamos o método fetch para consumir dados de uma API pública. Aqui está um resumo do fluxo:

- **Iniciar o carregamento:** O estado loading é definido como true.
- **Realizar a chamada:** Usamos fetch para buscar os dados.
- **Processamento da resposta:** Verificamos se a resposta foi bem-sucedida e convertemos para JSON.
- **Atualizar o estado:** Em caso de sucesso, atualizamos os dados e definimos loading para false. Se ocorrer erro, atualizamos o estado de erro.
- **Renderização Condicional:** Com base nos estados loading e error, renderizamos uma mensagem de carregamento, erro ou os dados obtidos.

**Gerenciamento dos Dados e Exibição na Interface**

O exemplo do componente Body mostra como:

- **Carregar Dados:** Com o useEffect para executar a chamada logo após a montagem.
- **Gerenciar Estados:** Utilizando useState para armazenar dados, status de carregamento e possíveis erros.
- **Renderizar Dados:** Usando renderização condicional para exibir mensagens apropriadas durante o carregamento ou em caso de erro, e listando os dados quando disponíveis.

**Dicas Importantes**

- **Axios:** Em projetos maiores, muitas vezes é preferível utilizar bibliotecas como o axios pela simplicidade na configuração de interceptors e tratamento de erros.
- **Tratamento de Erros:** Sempre trate erros de rede e de resposta para melhorar a experiência do usuário.
- **Renderização Condicional:** Garanta que a interface informe o usuário sobre o status da requisição (carregando, erro, sucesso).

Essa estrutura modular e o uso dos Hooks demonstram a flexibilidade do React para construir interfaces interativas e robustas, permitindo um desenvolvimento escalável e organizado.

## Projeto Prático

Vamos criar um exemplo prático de mini-projeto que reúne os conceitos de componentes, passagem de dados via props e consumo de API usando axios. Neste projeto, teremos:

- **Header:** Exibe o título do site.
- **Footer:** Exibe uma mensagem de copyright.
- **UserCard:** Um componente em formato de "card" que recebe os dados do usuário via props.
- **Body:** Componente responsável por fazer a chamada à API (usando axios) para obter a lista de usuários do JSONPlaceholder e renderizar os cards.

Você poderá testar e debugar cada parte, identificando erros comuns como problemas de conexão, tipagem incorreta e renderização condicional.

### Passos para Execução

**Criação do Projeto**

Utilize Vite com o template React + TypeScript:

```bash
npm create vite@latest users-app -- --template react-ts
cd users-app
npm install
npm install axios
```

Adicione os Componentes:

Crie os arquivos Header.tsx, Footer.tsx, UserCard.tsx e Body.tsx na pasta src.

Configuração do App:

Atualize o arquivo App.tsx para importar e compor os componentes conforme mostrado.

Testando a Aplicação:

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

### Estrutura dos Componentes

**Header.tsx**

Este componente exibe o cabeçalho da aplicação.

```tsx
// Header.tsx
import React from "react";

const Header: React.FC = () => {
  return (
    <header
      style={{
        backgroundColor: "#f0f0f0",
        padding: "1rem",
        textAlign: "center",
      }}
    >
      <h1>Users App</h1>
    </header>
  );
};

export default Header;
```

**Footer.tsx**

Este componente exibe o rodapé com informações de copyright.

```tsx
// Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: "#f0f0f0",
        padding: "1rem",
        textAlign: "center",
      }}
    >
      <p>&copy; 2025 Users App. Todos os direitos reservados.</p>
    </footer>
  );
};

export default Footer;
```

**UserCard.tsx**

O componente UserCard recebe um objeto de usuário via props e exibe suas informações. Aqui utilizamos uma interface para tipar os dados esperados.

```tsx
// UserCard.tsx
import React from "react";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1rem",
      }}
    >
      <h3>{user.name}</h3>
      <p>
        <strong>Username:</strong> {user.username}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
    </div>
  );
};

export default UserCard;
```

**Body.tsx**

Neste componente, usamos o hook useEffect para buscar os dados da API do JSONPlaceholder (endpoint de users) assim que o componente é montado. Utilizamos o axios para realizar a requisição e gerenciamos os estados de carregamento, erro e os dados obtidos.

```tsx
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
```

**App.tsx**

O componente principal compõe a aplicação, integrando os componentes Header, Body e Footer.

```tsx
// App.tsx
import React from "react";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";

const App: React.FC = () => {
  return (
    <div>
      <Header />
      <Body />
      <Footer />
    </div>
  );
};

export default App;
```

Acesse o navegador para verificar se os componentes estão sendo renderizados corretamente e se os dados dos usuários estão sendo exibidos.

## Boas Práticas e Próximos Passos

### Organização e Estruturação do Código em Projetos React

**Estrutura de Pastas:**

- **Componentes:** Separe os componentes em uma pasta, por exemplo, src/components/.
- **Hooks e Utilitários:** Crie pastas específicas para hooks customizados (src/hooks/) e funções utilitárias (src/utils/).
- **Assets e Estilos:** Mantenha imagens, estilos (CSS, SCSS) e fontes em pastas dedicadas (src/assets/).

**Nomenclatura Consistente:**

- Utilize nomes em PascalCase para componentes (ex.: Header.tsx, UserCard.tsx).
- Mantenha a consistência na nomenclatura de arquivos e pastas para facilitar a navegação e manutenção.

**Separação de Preocupações:**

- Isolar a lógica de negócios e a apresentação (UI) em arquivos ou funções separados.
- Utilize hooks customizados para encapsular lógicas reutilizáveis e evitar duplicação de código.

### Componentização e Reutilização de Código

**Componentes Reutilizáveis:**

- Desenvolva componentes que possam ser facilmente reutilizados em diferentes contextos da aplicação, como botões, formulários, modais e cartões (cards).

**Uso de Props para Flexibilidade:**

- Defina interfaces ou tipos para as props, garantindo que os componentes sejam flexíveis e seguros.
- Utilize a composição de componentes para construir interfaces mais complexas a partir de componentes menores.

**Hooks Customizados:**

- Quando uma lógica for utilizada em vários componentes, crie hooks customizados para centralizar essa lógica.
- Isso ajuda a manter o código limpo e facilita a manutenção.

### Recursos Adicionais para Aprofundamento

**Context API:**

- Ideal para estados globais simples.
- Permite compartilhar dados entre componentes sem precisar de bibliotecas externas.

**Redux:**

- Útil em aplicações maiores com estados mais complexos.
- Proporciona uma abordagem mais robusta, com middleware, e facilita a depuração.

**Roteamento:**

- **React Router:** A ferramenta padrão para gerenciar rotas e navegação em aplicações React. Permite definir rotas dinâmicas, criar links e proteger rotas de acesso.

**Outras Abordagens:**

- Para projetos que exigem server-side rendering (SSR) ou geração de sites estáticos (SSG), considere frameworks como Next.js, que integrados com o React oferecem funcionalidades avançadas para SEO e performance.

### Conclusão

Adotar boas práticas de organização e estruturação, aliadas à componentização e reutilização de código, é fundamental para construir aplicações escaláveis e de fácil manutenção em React. À medida que você se aprofunda na tecnologia, explorar o gerenciamento de estado e soluções de roteamento permitirá a criação de projetos mais complexos e robustos.

Estude os recursos adicionais, participe de comunidades e continue praticando. Essa evolução constante é essencial para se manter atualizado e melhorar a qualidade do seu código e dos seus projetos.
