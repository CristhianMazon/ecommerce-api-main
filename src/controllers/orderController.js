const Order = require('../models/Order');
const Product = require('../models/Product');
const OrderProduct = require('../models/OrderProduct');
const sequelize = require('../config/database'); // Importar o sequelize para transações

exports.createOrder = async (req, res) => {
    const t = await sequelize.transaction(); // Iniciar transação
    try {
        const { products } = req.body; // Ex: [{ productId: 1, quantity: 2 }, ...]
        const userId = req.userId;

        if (!products || !Array.isArray(products) || products.length === 0) {
            await t.rollback(); // Rollback em caso de erro de validação
            return res.status(400).json({ message: 'Produtos são obrigatórios e devem ser um array não vazio.' });
        }

        const order = await Order.create({ userId }, { transaction: t });

        for (const item of products) {
            const product = await Product.findByPk(item.productId, { transaction: t });
            if (!product) {
                await t.rollback(); // Rollback se um produto não for encontrado
                return res.status(404).json({ message: `Produto com ID ${item.productId} não encontrado.` });
            }

            const quantity = item.quantity || 1;
            if (product.stock < quantity) {
                await t.rollback(); // Rollback se não houver estoque suficiente
                return res.status(400).json({ message: `Estoque insuficiente para o produto ${product.name}.` });
            }

            // Subtrair do estoque
            await product.update({ stock: product.stock - quantity }, { transaction: t });

            await OrderProduct.create({
                orderId: order.id,
                productId: item.productId,
                quantity: quantity
            }, { transaction: t });
        }

        await t.commit(); // Confirmar transação
        res.status(201).json({ message: 'Pedido criado com sucesso', orderId: order.id });
    } catch (err) {
        await t.rollback(); // Rollback em caso de qualquer outro erro
        console.error('Erro ao criar pedido:', err);
        res.status(500).json({ message: 'Erro ao criar pedido', error: err.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await Order.findAll({
            where: { userId },
            include: {
                model: Product,
                through: { attributes: ['quantity'] }
            }
        });

        res.json(orders);
    } catch (err) {
        console.error('Erro ao buscar pedidos:', err);
        res.status(500).json({ message: 'Erro ao buscar pedidos', error: err.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        const order = await Order.findOne({
            where: { id, userId },
            include: {
                model: Product,
                through: { attributes: ['quantity'] }
            }
        });

        if (!order) return res.status(404).json({ message: 'Pedido não encontrado ou não pertence a este usuário.' });

        res.json(order);
    } catch (err) {
        console.error('Erro ao buscar pedido:', err);
        res.status(500).json({ message: 'Erro ao buscar pedido', error: err.message });
    }
};

exports.cancelOrder = async (req, res) => {
    const t = await sequelize.transaction(); // Iniciar transação
    try {
        const { id } = req.params;
        const userId = req.userId;

        const order = await Order.findOne({
            where: { id, userId },
            include: {
                model: Product, // Incluir produtos para repor estoque
                through: { attributes: ['quantity'] }
            },
            transaction: t
        });

        if (!order) {
            await t.rollback();
            return res.status(404).json({ message: 'Pedido não encontrado ou não pertence a este usuário.' });
        }

        // Repor o estoque dos produtos do pedido
        for (const productInOrder of order.Products) {
            const product = await Product.findByPk(productInOrder.id, { transaction: t });
            if (product) {
                await product.update({ stock: product.stock + productInOrder.OrderProduct.quantity }, { transaction: t });
            }
        }

        // Deletar as entradas da tabela OrderProduct e o pedido
        await OrderProduct.destroy({ where: { orderId: id }, transaction: t });
        await order.destroy({ transaction: t });

        await t.commit(); // Confirmar transação
        res.status(204).send();
    } catch (err) {
        await t.rollback(); // Rollback em caso de erro
        console.error('Erro ao cancelar pedido:', err);
        res.status(500).json({ message: 'Erro ao cancelar pedido', error: err.message });
    }
};