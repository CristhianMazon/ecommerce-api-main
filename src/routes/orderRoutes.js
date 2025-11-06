const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   - name: Pedidos
 *     description: Gerenciamento de pedidos
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Cria um novo pedido para o usuário autenticado
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *             properties:
 *               products:
 *                 type: array
 *                 description: Lista de produtos no pedido
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       description: ID do produto
 *                       example: 101
 *                     quantity:
 *                       type: integer
 *                       description: Quantidade do produto
 *                       example: 2
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Pedido criado com sucesso
 *                 orderId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: "Dados inválidos (ex: produtos ausentes, estoque insuficiente)"
 *       401:
 *         description: Não autorizado (token ausente ou inválido)
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 *
 *   get:
 *     summary: Lista todos os pedidos do usuário autenticado
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   userId:
 *                     type: integer
 *                     example: 1
 *                   Products:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 101
 *                         name:
 *                           type: string
 *                           example: Smartphone X
 *                         price:
 *                           type: number
 *                           format: float
 *                           example: 999.99
 *                         OrderProduct:
 *                           type: object
 *                           properties:
 *                             quantity:
 *                               type: integer
 *                               example: 2
 *       401:
 *         description: Não autorizado (token ausente ou inválido)
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', auth, orderController.createOrder);
router.get('/', auth, orderController.getUserOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obtém um pedido por ID para o usuário autenticado
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 userId:
 *                   type: integer
 *                   example: 1
 *                 Products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 101
 *                       name:
 *                         type: string
 *                         example: Smartphone X
 *                       price:
 *                         type: number
 *                         format: float
 *                         example: 999.99
 *                       OrderProduct:
 *                         type: object
 *                         properties:
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *       401:
 *         description: Não autorizado (token ausente ou inválido)
 *       404:
 *         description: Pedido não encontrado ou não pertence ao usuário
 *       500:
 *         description: Erro interno do servidor
 *
 *   delete:
 *     summary: Cancela um pedido do usuário autenticado
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do pedido a ser cancelado
 *     responses:
 *       204:
 *         description: Pedido cancelado com sucesso (Sem Conteúdo)
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Pedido não encontrado ou não pertence ao usuário
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', auth, orderController.getOrderById);
router.delete('/:id', auth, orderController.cancelOrder);

module.exports = router;
