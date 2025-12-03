const sequelize = require('../config/database');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order'); // Adicionado: Requer o modelo Order
const OrderProduct = require('../models/OrderProduct'); // Adicionado: Requer o modelo OrderProduct
const bcrypt = require('bcryptjs');

const populate = async () => {
  // ATENÇÃO: force: true vai APAGAR todas as tabelas existentes no DB
  // e recriá-las do zero. Use APENAS em desenvolvimento.
  await sequelize.sync({ force: true });

  console.log('Populando banco de dados...');

  // 1. Cria um usuário de exemplo
  const password = await bcrypt.hash('123456', 10);
  const user = await User.create({ name: 'Cristhian', email: 'cris@example.com', password });
  console.log('Usuário criado:', user.name);

  // 2. Cria categorias de exemplo
  const cat1 = await Category.create({ name: 'Eletrônicos' });
  const cat2 = await Category.create({ name: 'Roupas' });
  const cat3 = await Category.create({ name: 'Livros' });
  console.log('Categorias criadas:', cat1.name, cat2.name, cat3.name);

  // 3. Cria produtos de exemplo, associados às categorias
  const prod1 = await Product.create({
    name: 'Notebook Dell XPS 15',
    description: 'Notebook de alta performance com tela infinita e processador i7.',
    price: 4000.00,
    stock: 25,
    categoryId: cat1.id
  });
  const prod2 = await Product.create({
    name: 'Camiseta de Algodão Masculina',
    description: 'Camiseta básica 100% algodão, confortável e durável.',
    price: 50.00,
    stock: 100,
    categoryId: cat2.id
  });
  const prod3 = await Product.create({
    name: 'O Senhor dos Anéis: A Sociedade do Anel',
    description: 'Primeiro volume da clássica trilogia de fantasia de J.R.R. Tolkien.',
    price: 89.90,
    stock: 30,
    categoryId: cat3.id
  });
  console.log('Produtos criados:', prod1.name, prod2.name, prod3.name);

  // 4. Cria um pedido de exemplo para o usuário
  // NOTA: Ao criar um pedido, ele não terá produtos automaticamente.
  // Os produtos são adicionados via a tabela OrderProduct.
  const order1 = await Order.create({ userId: user.id });
  console.log('Pedido criado para o usuário:', user.name);

  // 5. Adiciona produtos ao pedido de exemplo via OrderProduct
  // Reduz o estoque dos produtos
  await OrderProduct.create({
    orderId: order1.id,
    productId: prod1.id,
    quantity: 1
  });
  await prod1.update({ stock: prod1.stock - 1 }); // Simula a redução de estoque
  console.log(`Produto "${prod1.name}" adicionado ao pedido.`);

  await OrderProduct.create({
    orderId: order1.id,
    productId: prod2.id,
    quantity: 2
  });
  await prod2.update({ stock: prod2.stock - 2 }); // Simula a redução de estoque
  console.log(`Produto "${prod2.name}" adicionado ao pedido.`);

  console.log('Banco populado com sucesso!');
  process.exit(); // Encerra o processo após a população
};

populate().catch(err => {
  console.error('Erro ao popular o banco de dados:', err);
  process.exit(1); // Encerra com erro
});
