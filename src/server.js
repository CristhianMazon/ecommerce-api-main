const app = require('./app');
const sequelize = require('./config/database');

// IMPORTAR MODELOS para que associações funcionem corretamente
require('./models/User');
require('./models/Category');
require('./models/Product');
require('./models/Order');
require('./models/OrderProduct');

sequelize.sync().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
  });
});
