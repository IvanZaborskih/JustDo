const {Tag} = require('../models/models');

class TagController {
    async create(req, res) {
        try {
            req.body.id = req.user.id;
            const {title} = req.body;

            const tag = await Tag.create({title, userId: req.body.id});
            if (!tag) {
                throw new Error();
            } else {
                res.status(200).json(tag);
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    async getAll(req, res) {
        try {
            const userId = req.user.id;
            const tags = await Tag.findAll({where: {userId} });
            if (!tags) {
                throw new Error();
            } else {
                res.json(tags);
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    async update(req, res) {
        try {
            const tagId = req.params.id;
            const {title} = req.body;
            const tag = await Tag.update(
                {title: title},
                {where: {id: tagId} });
            if (!tag) {
                throw new Error();
            } else {
                res.status(200).json(tag);
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    async delete(req, res) {
        try {
            const tagId = req.params.id;
            const tag = await Tag.destroy({where: {id: tagId}});
            if (!tag) {
                throw new Error();
            } else {
                res.status(200).json({message: 'Тег удалён'});
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
}

module.exports = new TagController();