# 📘 Trabalho Avaliativo – TypeScript na Prática

Este trabalho tem como objetivo aplicar os conceitos de **TypeScript** em cenários reais de mercado. Cada questão propõe uma situação prática onde você deverá projetar e implementar uma solução usando os recursos da linguagem. Utilize **tipagem estática, interfaces, classes, generics, type guards, union types, async/await**, entre outros recursos discutidos em aula.

## 📌 Instruções Gerais do Trabalho Avaliativo

O trabalho é composto por **15 questões no total**. Para ter a chance de atingir a **nota máxima**, você deverá **obrigatoriamente entregar pelo menos 10 questões concluídas**.

- As **10 questões obrigatórias** correspondem a **100% da nota (10 pontos)**. Ou seja, se você entregar **10 questões corretamente**, garantirá a nota máxima.
- **Cada questão extra**, além das 10 obrigatórias, valerá **0,5 ponto adicional** (5%), funcionando como **complemento de nota** ou forma de **recuperar descontos**.
- Você poderá **escolher livremente quais serão suas 10 questões obrigatórias**, desde que **as destaque no documento entregue** (ex: com um asterisco ou comentário). As demais serão consideradas como extras.

---

## 📅 Data, Local e Entrega

- **Data do trabalho:** 25/03/2025
- **Horário:** das **19h15 às 22h30**
- **Local:** Laboratório IT Lab (**presencial**)

---

## 📤 Forma de Entrega

- A entrega será feita exclusivamente via **Google Classroom**.
- O trabalho deverá estar hospedado em um **repositório GitHub privado**.
- Adicione meu usuário GitHub como colaborador: **`nunesfb`**.
- O **último commit válido deve estar dentro do horário estipulado**.
  > ⚠️ Commits realizados **após as 22h30 serão desconsiderados** e o trabalho será **zerado**.

---

## 🚫 Plágio e Comentários Obrigatórios

- Códigos idênticos entre colegas ou gerados exclusivamente por IA (como o ChatGPT) serão **analisados cuidadosamente**.
- Cópias evidentes resultarão em **desconto de nota** ou **anulação da questão**.
- **Todos os códigos devem conter comentários explicativos pessoais**, demonstrando sua compreensão sobre o que foi implementado.

---

## ✅ Dicas Finais

- Organize bem o seu repositório: uma pasta para cada questão é o ideal.
- Comente cada função ou classe explicando sua finalidade.
- Teste seus códigos antes de entregar.
- Foque na clareza e na boa prática de programação com TypeScript.

Boa sorte! 💻🚀

---

## Questão 1 – Validação Dinâmica de Dados

Você está atuando como desenvolvedor em uma **fintech**, e é responsável por validar os dados de clientes recebidos via JSON antes de armazená-los em uma base de dados.  
Crie uma função que:

- Receba um objeto JSON com dados de cliente.
- Verifique se os campos obrigatórios `nome`, `cpf` e `rendaMensal` existem.
- Valide se os tipos dos valores estão corretos: `nome` e `cpf` devem ser `string`, e `rendaMensal` deve ser `number`.
- Lance uma exceção (`throw`) com uma mensagem clara se algum campo estiver ausente ou com o tipo incorreto.

---

## Questão 2 – Pipeline de Processamento de Pedidos

Uma plataforma de **e-commerce** precisa aplicar múltiplas regras de desconto em um carrinho de compras, como:

- Descontos por categoria de produto.
- Descontos sazonais (ex: Black Friday).
- Outros descontos futuros.

Implemente uma **pipeline de descontos** com as seguintes características:

- Aplique as regras sequencialmente sobre o carrinho.
- Permita que novas regras sejam adicionadas de forma simples e modular.
- Calcule e retorne o valor final do carrinho com os descontos aplicados.

---

## Questão 3 – Gerenciamento de Tarefas com Classes e Interfaces

Você está criando um app de **gestão de tarefas** para uma startup. Cada tarefa pode estar em um dos seguintes estados: `pendente`, `fazendo` ou `concluída`.

Implemente um sistema com as seguintes funcionalidades:

- Criação de tarefas.
- Alteração de status.
- Listagem de tarefas por status.
- Cálculo da quantidade total de tarefas concluídas.

Utilize **interfaces** e **classes** para organizar o código.

---

## Questão 4 – Função Assíncrona com Simulação de API

Crie uma função que simula a chamada assíncrona de uma **API de cotações de moedas**.  
Sua função deve:

- Ser assíncrona (`async`).
- Retornar um objeto no formato `{ moeda: string; valor: number }`.
- Simular um atraso de resposta.
- Tratar possíveis falhas usando `try/catch` (ex: falha na conexão ou erro no retorno dos dados).

---

## Questão 5 – Estoque Inteligente com Generics

Uma loja está desenvolvendo um sistema de **controle de estoque inteligente** que deve funcionar para diferentes tipos de produtos: roupas, eletrônicos, alimentos, etc.

Implemente uma estrutura com as seguintes características:

- Use **Generics** para garantir que produtos de tipos diferentes sejam tratados separadamente.
- Crie métodos para **adicionar**, **remover** e **listar** os produtos armazenados.

---

## Questão 6 – Funções Compostas e Transformação de Dados

Uma empresa de análise financeira precisa de uma função que processe um **array de valores numéricos**.

Sua função deve:

1. Filtrar valores que estejam acima de um determinado mínimo ((v) => v > minimo).
2. Aplicar uma taxa de crescimento percentual sobre esses valores ((v) => v \* (1 + taxa)).
3. Ordenar os valores finais em **ordem decrescente** ((a, b) => b - a).

Utilize **funções encadeadas** (`filter`, `map`, `sort`) para realizar esse processo de forma funcional e elegante.

---

## Questão 7 – Controle de Acesso com Interface e Classes

Você precisa desenvolver um **sistema de login e permissão** de acesso para uma aplicação web.

O sistema deve:

- Utilizar uma **interface** para definir a estrutura do usuário.
- Usar **classes** para encapsular a lógica de autenticação e autorização.
- Verificar se o `email` e `senha` fornecidos existem no sistema.
- Permitir ou negar o acesso a recursos protegidos.

Exemplo:

```ts
private usuarios: Usuario[] = [{ email: "admin@site.com", senha: "1234" }];
```

---

## Questão 8 – Sistema de Pagamentos com Union Types

Você está desenvolvendo um sistema de **pagamentos** que aceita dois métodos: **cartão de crédito** e **boleto bancário**.

Implemente uma função que:

- Receba um objeto representando a transação.
- Use **Union Types** para definir os dois formatos possíveis.
- Aplique **type narrowing** (verificação de tipo em tempo de execução) para processar corretamente cada tipo de pagamento.

Exemplo:

```ts
type Pagamento =
  | { tipo: "cartao"; numero: string; cvv: string }
  | { tipo: "boleto"; codigoBarras: string };
```

---

## Questão 9 – Classe Abstrata e Polimorfismo em Logística

Uma transportadora precisa calcular os **custos de frete** de acordo com o tipo de veículo utilizado: `Carro`, `Moto` ou `Caminhão`.

Implemente:

- Uma **classe abstrata** com um método para cálculo de custo.
- Subclasses específicas para cada tipo de veículo.
- O uso de **polimorfismo** para permitir que diferentes objetos usem o mesmo método com comportamentos distintos.

---

## Questão 10 – Tratamento de Erros Avançado com API Externa

Você está integrando um sistema com uma **API externa instável** que pode retornar erros como:

- Timeout
- Servidor fora do ar
- Dados inconsistentes

Crie uma função assíncrona que:

- Faça uma requisição simulada à API.
- Utilize `async/await`.
- Faça tratamento detalhado dos erros com mensagens claras para cada tipo de falha.
- Retorne mensagens de erro adequadas ao usuário final.

Exemplo:

```ts
const res = await fetch("https://api.exemplo.com/dados");
```

---

## Questão 11 – CRUD Genérico em Memória com Type Aliases

Implemente um **CRUD genérico** em memória para gerenciar diferentes tipos de entidades, como `Usuários`, `Produtos`, `Pedidos`, etc.

Sua solução deve:

- Utilizar **Type Aliases** para definir as entidades.
- Usar **Generics** para criar uma classe reutilizável.
- Ter métodos para **criar**, **buscar**, **atualizar** e **deletar** objetos da coleção.

---

## Questão 12 – Type Guards e Manipulação de Objetos Dinâmicos

Você está desenvolvendo um sistema de autenticação que recebe objetos de diferentes tipos, como:

- Usuário completo (com nome, email, senha)
- Usuário temporário (com token de acesso)

Implemente uma função que:

- Use **Type Guards** para verificar dinamicamente o tipo de objeto recebido.
- Retorne mensagens específicas e seguras com base no tipo identificado.

Exemplo:

```ts
interface UsuarioCompleto {
  tipo: "completo";
  nome: string;
  email: string;
}

interface UsuarioTemporario {
  tipo: "temporario";
  token: string;
}
```

---

## Questão 13 – Sistema de Notificação com Interfaces

Um aplicativo precisa enviar **notificações** para os usuários via **e-mail** e **SMS**.

Implemente:

- Uma **interface comum** para notificações.
- Classes separadas para cada tipo (Email e SMS).
- Validação dos dados antes do envio (formato de e-mail, número de telefone).
- Um método `enviar()` em cada classe que imprima a mensagem no console.

```ts
interface Notificacao {
  enviar(destinatario: string, mensagem: string): void;
}
```

---

## Questão 14 – Sistema de Controle Financeiro com Interface, Classes e Encapsulamento

Você está criando um sistema simples de **investimentos financeiros**, com opções como:

- Poupança
- Renda Fixa
- Fundos

Crie:

- Uma **interface** que defina métodos comuns para todos os investimentos.
- **Classes específicas** para cada tipo de investimento.
- Cálculos de rendimento, taxa administrativa e saldo final.
- Utilize **encapsulamento** para proteger os dados internos da aplicação.

---

## Questão 15 – Manipulação Avançada de Dados Bancários com Utility Types

Um banco precisa disponibilizar dados públicos de seus clientes, mas **sem expor informações sensíveis** como `senha` e `cpf`.

Implemente uma função que:

- Receba um objeto com os dados completos do cliente.
- Utilize **Utility Types** como `Omit` ou `Pick` para criar uma versão "limpa" e segura do objeto.
- Retorne somente as informações que podem ser exibidas publicamente (como nome e e-mail).

Exemplo:

```ts
type Cliente = {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
};
```
