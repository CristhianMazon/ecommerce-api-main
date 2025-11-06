const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   - name: Produtos
 *     description: Gerenciamento de produtos
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos
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
 *                   name:
 *                     type: string
 *                     example: Smartphone X
 *                   price:
 *                     type: number
 *                     format: float
 *                     example: 999.99
 *                   stock:
 *                     type: integer
 *                     example: 50
 *                   categoryId:
 *                     type: integer
 *                     example: 1
 *                   Category:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Eletrônicos
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Retorna um produto por ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Smartphone X
 *                 price:
 *                   type: number
 *                   format: float
 *                   example: 999.99
 *                 stock:
 *                   type: integer
 *                   example: 50
 *                 categoryId:
 *                   type: integer
 *                   example: 1
 *                 Category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Eletrônicos
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - categoryId
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do produto
 *                 example: Smart TV 4K
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Preço do produto
 *                 example: 2500.00
 *               categoryId:
 *                 type: integer
 *                 description: ID da categoria do produto
 *                 example: 1
 *               stock:
 *                 type: integer
 *                 description: Quantidade em estoque
 *                 example: 30
 *     responses:
 *       201:
 *         description: Produto criado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 102
 *                 name:
 *                   type: string
 *                   example: Smart TV 4K
 *                 price:
 *                   type: number
 *                   example: 2500.00
 *                 stock:
 *                   type: integer
 *                   example: 30
 *                 categoryId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Categoria não encontrada ou dados inválidos
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', auth, productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Atualiza um produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do produto a ser atualizado
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Novo nome do produto (opcional)
 *                 example: Smart TV 4K (Atualizada)
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Novo preço do produto (opcional)
 *                 example: 2400.00
 *               categoryId:
 *                 type: integer
 *                 description: Nova ID da categoria (opcional)
 *                 example: 1
 *               stock:
 *                 type: integer
 *                 description: Nova quantidade em estoque (opcional)
 *                 example: 25
 *     responses:
 *       200:
 *         description: Produto atualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Smart TV 4K (Atualizada)
 *                 price:
 *                   type: number
 *                   example: 2400.00
 *                 stock:
 *                   type: integer
 *                   example: 25
 *                 categoryId:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Categoria inválida ou estoque negativo
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', auth, productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Exclui um produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do produto a ser excluído
 *     responses:
 *       204:
 *         description: Produto deletado com sucesso (Sem Conteúdo)
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Produto não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;
