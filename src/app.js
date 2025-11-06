// src/app.js
const express = require('express');
const app = express();
const cors = require('cors'); // Importa o módulo CORS

// Importa as rotas da API
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Importa as configurações do Swagger para documentação da API
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

// Middleware para parsear o corpo das requisições como JSON
app.use(express.json());

// Configuração do CORS (Cross-Origin Resource Sharing)
// CORREÇÃO DE VULNERABILIDADE LOW (CORS PERMISSIVO):
// Restringido para a origem do frontend em desenvolvimento (http://localhost:5173).
// Em um ambiente de produção, esta origem deve ser alterada para o domínio real do frontend.
app.use(cors({
  origin: 'http://localhost:5173', // Permite requisições APENAS da origem do seu frontend React
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
  credentials: true, // Permite o envio de cookies de credenciais (se necessário)
  allowedHeaders: 'Content-Type,Authorization', // Cabeçalhos permitidos na requisição
}));


// Define as rotas da API
app.use('/api/auth', authRoutes); // Rotas de autenticação (registro, login)
app.use('/api/categories', categoryRoutes); // Rotas de categorias de produtos
app.use('/api/products', productRoutes); // Rotas de produtos
app.use('/api/users', userRoutes); // Rotas de usuários (perfil)
app.use('/api/orders', orderRoutes); // Rotas de pedidos

// Configura a rota para a documentação interativa da API com Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Exporta a instância do aplicativo Express
module.exports = app;