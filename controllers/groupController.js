const {Group} = require('../models/models');

class GroupController {
    async create(req, res) {
        try {
            req.body.id = req.user.id;
            const {title} = req.body;

            const group = await Group.create({title, userId: req.body.id});
            if (!group) {
                throw new Error();
            } else {
                res.status(200).json(group);
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    async getAll(req, res) {
        try {
            const userId = req.user.id;
            const groups = await Group.findAll({where: {userId} });
            if (!groups) {
                throw new Error();
            } else {
                res.json(groups);
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    async update(req, res) {
        try {
            const groupId = req.params.id;
            const {title} = req.body;
            const group = await Group.update(
                {title: title},
                {where: {id: groupId} });
            if (!group) {
                throw new Error();
            } else {
                res.status(200).json(group);
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    async delete(req, res) {
        try {
            const groupId = req.params.id;
            const group = await Group.destroy({where: {id: groupId}});
            if (!group) {
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