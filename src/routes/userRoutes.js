const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   - name: Usuários
 *     description: Gerenciamento do perfil do usuário autenticado
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Retorna o perfil do usuário autenticado
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do usuário
 *                   example: 1
 *                 name:
 *                   type: string
 *                   description: Nome do usuário
 *                   example: John Doe
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Email do usuário
 *                   example: john.doe@example.com
 *       401:
 *         description: Não autorizado (token inválido ou ausente)
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/me', auth, userController.getAuthenticatedUser);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Atualiza o perfil do usuário autenticado
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Novo nome do usuário (opcional)
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Novo email do usuário (opcional)
 *                 example: jane.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Nova senha do usuário (opcional)
 *                 example: newSecurePassword123
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Perfil atualizado com sucesso!
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Jane Doe
 *                     email:
 *                       type: string
 *                       example: jane.doe@example.com
 *       400:
 *         description: E-mail já em uso ou dados inválidos
 *       401:
 *         description: Não autorizado (token inválido ou ausente)
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/me', auth, userController.updateAuthenticatedUser);

/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: Exclui o perfil do usuário autenticado
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Perfil deletado com sucesso (Sem Conteúdo)
 *       401:
 *         description: Não autorizado (token inválido ou ausente)
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/me', auth, userController.deleteAuthenticatedUser);

module.exports = router;
