const Category = require('../models/Category');
const Product = require('../models/Product');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar categoria', error });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ include: Product });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar categorias', error });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ message: 'Categoria não encontrada' });

    await category.update({ name });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar categoria', error });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id, { include: Product });

    if (!category) return res.status(404).json({ message: 'Categoria não encontrada' });
    if (category.Products.length > 0)
      return res.status(400).json({ message: 'Categoria possui produtos associados' });

    await category.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar categoria', error });
  }
};
