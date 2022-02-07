const {Category} = require('../models/models');

class CategoryController {
    async create(req, res) {
        try {
            req.body.id = req.user.id;
            const {title, icon} = req.body;

            const category = await Category.create({title, icon, userId: req.body.id});
            if (!category) {
                throw new Error();
            } else {
                res.status(200).json(category);
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    async getAll(req, res) {
        try {
            const userId = req.user.id;
            const categories = await Category.findAll({where: {userId} });
            if (!categories) {
                throw new Error();
            } else {
                res.json(categories);
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    async update(req, res) {
        try {
            const categoryId = req.params.id;
            const {title, icon} = req.body;
            const categories = await Category.update(
                {title: title, icon: icon},
                {where: {id: categoryId} });
            if (!categories) {
                throw new Error();
            } else {
                res.status(200).json(categories);
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    async delete(req, res) {
        try {
            const categoriesId = req.params.id;
            const category = await Category.destroy({where: {id: categoriesId}});
            if (!category) {
                throw new Error();
            } else {
                res.status(200).json({message: 'Категория удалена'});
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
}

module.exports = new CategoryController();