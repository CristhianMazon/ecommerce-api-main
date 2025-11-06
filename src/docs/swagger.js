const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Backend',
      version: '1.0.0',
      description: 'API RESTful robusta, modular e segura para um sistema de e-commerce.',
    },
    // Adicionado para configurar a autenticação JWT no Swagger UI
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token de autenticação JWT (Ex: Bearer <seu_token>)',
        },
      },
    },
    // Opcional: Se a maioria das suas rotas forem protegidas por bearerAuth, você pode definir globalmente.
    // security: [{
    //   bearerAuth: [],
    // }],
  },
  apis: ['./src/routes/*.js'], // Caminho para os arquivos de rotas que contêm os comentários JSDoc
};

module.exports = swaggerJsdoc(options);
