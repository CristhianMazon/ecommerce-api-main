
# 💻 API Backend e Frontend — Trabalho Acadêmico

Este repositório contém o projeto final da disciplina de **Desenvolvimento Backend**, focado na construção de uma **API RESTful robusta, modular e segura**, e um **Frontend** para consumir essa API.

A aplicação backend utiliza a stack **Node.js com JavaScript**, integrada a um banco de dados relacional **MySQL**, com mapeamento de dados feito por meio do **Sequelize**. O frontend é desenvolvido com **React.js**.

---

## 📌 Objetivo

Este projeto demonstra, na prática, o uso do padrão **MVC** no backend e uma aplicação **React** no frontend, com foco em:

- 🔐 **Autenticação com JWT** e criptografia de senhas (bcryptjs)  
- 📦 **Gestão completa de entidades**: Usuários, Produtos, Categorias e Pedidos  
- 🔄 **Relacionamentos complexos** entre tabelas (1:N, N:N)  
- 🧾 **Transações de banco de dados** (ex: controle de estoque ao criar pedidos)  
- 📘 **Documentação interativa da API com Swagger**  
- 🧱 **Código modular**, seguro e de fácil manutenção  
- ⚛️ **Frontend em React** para consumir a API, gerenciando autenticação (Context API) e carrinho de compras  

---

## 🛠️ Tecnologias Utilizadas

### Backend

- **Node.js** → Ambiente de execução JavaScript no servidor  
- **Express.js** → Framework web para APIs RESTful  
- **MySQL** → Banco de dados relacional  
- **Sequelize** → ORM para manipulação de dados  
- **bcryptjs** → Criptografia de senhas  
- **jsonwebtoken** → Autenticação via JWT  
- **dotenv** → Gerenciamento de variáveis de ambiente  
- **Swagger** → Documentação interativa da API  
- **Nodemon** → Reinício automático em desenvolvimento  
- **CORS** → Gerenciamento de Cross-Origin Resource Sharing  

### Frontend (React)

- **React.js** → Biblioteca JavaScript para construir interfaces de usuário  
- **Vite** → Ferramenta de build frontend moderna e rápida  
- **Context API** → Para gerenciamento de estado global (autenticação e carrinho)  
- **ESLint** → Para padronização e garantia de qualidade de código  
- **CSS puro** → Para estilização dos componentes  

---

## 📁 Estrutura do Projeto

```text
📦 ecommerce-api
├── 📁 src/                     # Código fonte do Backend
│   ├── 📁 config/              → Conexão com banco de dados
│   │   └── database.js
│   ├── 📁 controllers/         → Lógica dos endpoints
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── 📁 models/              → Definição das entidades e relacionamentos
│   │   ├── Category.js
│   │   ├── Order.js
│   │   ├── OrderProduct.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── 📁 middlewares/         → Autenticação e validações
│   │   └── auth.js
│   ├── 📁 routes/              → Endpoints organizados por entidade
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── 📁 docs/                → Configuração Swagger
│   │   └── swagger.js
│   ├── 📁 utils/               → Scripts auxiliares
│   │   └── populate.js
│   ├── app.js                  → Configuração principal do Express
│   └── server.js               → Inicialização da aplicação
├── 📁 my-ecommerce-app/        # Código fonte do Frontend (Aplicação React)
│   ├── 📁 public/              
│   ├── 📁 src/                 
│   │   ├── 📁 components/      → Componentes reutilizáveis (Login, Register, ProductList, CartView, UserProfile, OrderList, Modal, EditProfileForm)
│   │   ├── 📁 context/         → Contextos de React (AuthContext, CartContext)
│   │   ├── 📁 config/          → Configurações do frontend (ex: URL da API)
│   │   ├── App.css             → Estilos CSS globais da aplicação
│   │   ├── App.jsx             → Componente principal da aplicação
│   │   ├── index.css           → Estilos CSS iniciais
│   │   └── main.jsx            → Ponto de entrada do React
│   ├── .eslintrc.cjs           → Configuração ESLint
│   ├── index.html              → Arquivo HTML principal
│   ├── package.json            → Dependências e scripts do Frontend
│   ├── package-lock.json       → Controle de versões do Frontend
│   └── vite.config.js          → Configuração do Vite
├── .env.example                → Exemplo de variáveis de ambiente do Backend
├── package.json                → Dependências e scripts do Backend
└── package-lock.json           → Controle de versões do Backend
```

---

---
## 📄 8. Lista de Manutenções Realizadas (Requisito de Recuperação)

O projeto demonstrou os seguintes tipos de manutenção através do fluxo de branches Git:

1.  **Manutenção Evolutiva (`feature/*`)**:
    - **Exemplo:** Implementação da funcionalidade completa do **Carrinho de Compras** e **Checkout**.
2.  **Manutenção Corretiva (`fix/*`)**:
    - **Exemplo:** Correção da lógica de estoque em `src/controllers/orderController.js` para garantir a **reposição correta** de produtos ao cancelar um pedido.
3.  **Manutenção Perfectiva (`refactor/*`)**:
    - **Exemplo:** Refatoração no `CartContext.jsx` para incluir **validação de estoque** no frontend, melhorando a robustez e desempenho do carrinho.
4.  **Manutenção Adaptativa (`refactor/*`)**:
    - **Exemplo:** Ajuste na configuração CORS em `src/app.js` para se **adaptar** ao ambiente de desenvolvimento do React (porta 5173), mantendo a segurança.

## 🚀 Como Executar o Projeto

### ✅ Pré-requisitos

- Node.js (v14 ou superior)  
- MySQL Server (recomenda-se o XAMPP ou Docker)  
- MySQL Workbench (opcional, para gerenciar o banco de dados)  

### 🧰 Instalação e Configuração do Backend

1. Clone o repositório:

```bash
git clone https://github.com/CristhianMazon/ecommerce-api.git
cd ecommerce-api
```

2. Instale as dependências do Backend:

```bash
npm install
```

3. Configure o ambiente do Backend:

Crie um arquivo `.env` na raiz do projeto (`ecommerce-api/`) com base no `.env.example`:

```env
PORT=3000
JWT_SECRET=sua_chave_secreta_jwt_bem_longa_e_aleatoria
DB_NAME=api_ecommerce_db
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
```

> 🔒 Altere `DB_USER` e `DB_PASSWORD` conforme suas credenciais MySQL. Se estiver usando XAMPP, `DB_USER` geralmente é `root` e `DB_PASSWORD` é vazio por padrão.

4. Inicie o MySQL (via XAMPP ou similar).

5. Crie o banco de dados (ex: `api_ecommerce_db`) manualmente com o nome do `.env`.

6. Popule o banco com dados iniciais:

```bash
npm run populate
```

7. Execute a aplicação Backend:

```bash
npm run dev
```

> O servidor estará em `http://localhost:3000`.

---

### ⚛️ Instalação e Configuração do Frontend

1. Navegue até o diretório do frontend:

```bash
cd my-ecommerce-app
```

2. Instale as dependências:

```bash
npm install
```

3. Verifique a URL da API:

```js
// src/config/api.js
const API_BASE_URL = 'http://localhost:3000/api';
export { API_BASE_URL };
```

4. Execute a aplicação:

```bash
npm run dev
```

> A aplicação estará em `http://localhost:5173`.

---

## 🧪 Testando a Aplicação

### 📘 Swagger

```
http://localhost:3000/api-docs
```

### 🔐 Login de Teste

- **Email:** cris@example.com  
- **Senha:** 123456  

### Carrinho e Pedidos

- Adicionar produtos ao carrinho  
- Finalizar pedido (estoque atualizado)  
- Ver ou cancelar pedidos (reposiciona estoque)  

---

## 📚 Observações Adicionais

### Backend

- JWT + senhas criptografadas com bcryptjs  
- Transações garantem integridade de pedidos  
- Relacionamentos Sequelize bem definidos  
- CORS liberado para dev (restrinja em prod)  

### Frontend

- AuthContext e CartContext para controle de estado  
- Atualização de perfil e uso de modais reutilizáveis  

---

## 👨‍💻 Autor

**Cristhian Silveira Mazon**  
📧 [cristhian.s.mazon@gmail.com](mailto:cristhian.s.mazon@gmail.com)
