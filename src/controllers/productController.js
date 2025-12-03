const Product = require('../models/Product');
const Category = require('../models/Category');

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, categoryId, stock } = req.body; // Adicionado 'description'

        // Validação básica: nome, preço, categoria e estoque são obrigatórios. Estoque não pode ser negativo.
        if (!name || !price || !categoryId || stock === undefined || stock < 0) {
            return res.status(400).json({ message: 'Nome, preço, categoria e estoque são obrigatórios. Estoque não pode ser negativo.' });
        }

        const category = await Category.findByPk(categoryId);
        if (!category) {
            return res.status(400).json({ message: 'Categoria não encontrada.' });
        }

        // Cria o produto com os dados fornecidos, incluindo a descrição e o estoque.
        const product = await Product.create({ name, description, price, categoryId, stock });
        res.status(201).json(product);
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        res.status(500).json({ message: 'Erro ao criar produto', error: error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        // Inclui a categoria associada a cada produto
        const products = await Product.findAll({ include: Category });
        res.json(products);
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        res.status(500).json({ message: 'Erro ao listar produtos', error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        // Busca um produto pelo ID e inclui sua categoria
        const product = await Product.findByPk(id, { include: Category });

        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        res.json(product);
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({ message: 'Erro ao buscar produto', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, categoryId, stock } = req.body; // Adicionado 'description'

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        // Verifica se a nova categoria existe, se categoryId foi fornecido
        if (categoryId) {
            const category = await Category.findByPk(categoryId);
            if (!category) {
                return res.status(400).json({ message: 'Categoria inválida.' });
            }
        }

        // Validação de estoque para atualização: não pode ser negativo
        if (stock !== undefined && stock < 0) {
            return res.status(400).json({ message: 'Estoque não pode ser negativo.' });
        }

        // Atualiza apenas os campos que foram fornecidos na requisição
        await product.update({
            name: name !== undefined ? name : product.name,
            description: description !== undefined ? description : product.description, // Atualiza descrição
            price: price !== undefined ? price : product.price,
            categoryId: categoryId !== undefined ? categoryId : product.categoryId,
            stock: stock !== undefined ? stock : product.stock
        });
        res.json(product);
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        res.status(500).json({ message: 'Erro ao atualizar produto', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        await product.destroy();
        res.status(204).send(); // 204 No Content para deleção bem-sucedida
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({ message: 'Erro ao deletar produto', error: error.message });
    }
};
