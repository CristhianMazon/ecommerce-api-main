const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getAuthenticatedUser = async (req, res) => {
    try {
        const userId = req.userId; // Vem do middleware de autenticação
        const user = await User.findByPk(userId, {
            attributes: ['id', 'name', 'email'] // Evitar enviar a senha
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.json(user);
    } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        res.status(500).json({ message: 'Erro ao buscar perfil do usuário.', error: error.message });
    }
};

exports.updateAuthenticatedUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, email, password } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Este e-mail já está em uso.' });
            }
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;

        await user.update({
            name: name || user.name,
            email: email || user.email,
            password: hashedPassword
        });

        // Retorna o usuário atualizado sem a senha
        const updatedUser = await User.findByPk(userId, {
            attributes: ['id', 'name', 'email']
        });

        res.json({ message: 'Perfil atualizado com sucesso!', user: updatedUser });
    } catch (error) {
        console.error('Erro ao atualizar perfil do usuário:', error);
        res.status(500).json({ message: 'Erro ao atualizar perfil do usuário.', error: error.message });
    }
};

exports.deleteAuthenticatedUser = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        await user.destroy();
        res.status(204).send(); // 204 No Content para deleção bem-sucedida
    } catch (error) {
        console.error('Erro ao deletar perfil do usuário:', error);
        res.status(500).json({ message: 'Erro ao deletar perfil do usuário.', error: error.message });
    }
};
