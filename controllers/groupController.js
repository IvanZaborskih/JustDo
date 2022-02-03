const {Group} = require('../models/models');

class GroupController {
    async create(req, res) {
        try {
            req.body.id = req.user.id;
            const {title} = req.body;

            const tag = await Group.create({title, userId: req.body.id});
            if (!tag) {
                throw new Error();
            } else {
                res.status(200).json({message: 'Группа создана'});
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    async getAll(req, res) {
        try {
            const userId = req.user.id;
            const tags = await Group.findAll({where: {userId} });
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
            const tags = await Group.update(
                {title: title},
                {where: {id: tagId} });
            if (!tags) {
                throw new Error();
            } else {
                res.status(200).json({message: 'Название группы обновлено'});
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    async delete(req, res) {
        try {
            const tagId = req.params.id;
            const tag = await Group.destroy({where: {id: tagId}});
            if (!tag) {
                throw new Error();
            } else {
                res.status(200).json({message: 'Группа удалена'});
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
}

module.exports = new GroupController();