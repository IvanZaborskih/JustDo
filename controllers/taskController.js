const {Task, Category, Priority, Group, Notification, Tag, TaskTag} = require('../models/models');

const addTagsToTask = async (taskId, tagsTitleArray) => {
    await Task.findOne({where: {id: taskId}})
        .then(async task => {
            for (let i = 0; i < tagsTitleArray.length; i++) {
                await Tag.findOne({where: {title: tagsTitleArray[i]}})
                    .then(async tag => {
                        await task.addTag(tag, {through: TaskTag});
                    });
            }
        });
};

const deleteOldTags = async (taskId) => {
    await Task.findOne({where: {id: taskId}})
        .then(async task => {
            await task.getTags().then(tags => {
                for (tag of tags) {
                    tag.task_tag.destroy();
                }
            })
        });
}

const calculateRemindIn = (deadline, notificationTime) => {
    const dateInMs = Date.parse(deadline);
    return new Date(dateInMs - notificationTime);
};


class TaskController {
    async create(req, res) {
        try {
            req.body.id = req.user.id;
            const {title, description, deadline, categoryTitle, priorityColor, notificationTime, tagsTitleArray} = req.body;
            const category = await Category.findOne({where: {title: categoryTitle, userId: req.user.id}});
            const priority = await Priority.findOne({where: {color: priorityColor}});
            const notification = await Notification.findOne({where: {time: notificationTime}});
            const remindIn = calculateRemindIn(deadline, notificationTime);
            let task;

            if (!category) {
                task = await Task.create({
                    title,
                    description,
                    deadline,
                    remind_in: remindIn,
                    userId: req.user.id,
                    priorityId: priority.id,
                    notificationId: notification.id
                });
            } else {
                task = await Task.create({
                    title,
                    description,
                    deadline,
                    remind_in: remindIn,
                    categoryId: category.id,
                    userId: req.user.id,
                    priorityId: priority.id,
                    notificationId: notification.id
                });
            }

            await addTagsToTask(task.id, tagsTitleArray);

            task = await Task.findOne({
                where: {id: task.id},
                include: [
                    {model: Priority},
                    {model: Category},
                    {model: Notification},
                    {model: Group},
                    {model: Tag, through: {attributes: []}}
                ]
            });

            if (!task) {
                throw new Error();
            } else {
                res.status(200).json(task);
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    async getAll(req, res) {
        try {
            const userId = req.user.id;

            const tasks = await Task.findAll({
                where: {userId},
                include: [
                    {model: Priority},
                    {model: Category},
                    {model: Notification},
                    {model: Group},
                    {model: Tag, through: {attributes: []}}
                ]
            });
            if (!tasks) {
                throw new Error();
            } else {
                res.status(200).json(tasks);
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    async getOne(req, res) {
        try {
            const userId = req.user.id;
            const taskId = req.params.id;
            const task = await Task.findOne({
                where: {id: taskId, userId: userId},
                include: [
                    {model: Priority},
                    {model: Category},
                    {model: Notification},
                    {model: Group},
                    {model: Tag, through: {attributes: []}}
                ]
            });
            if (!task) {
                throw new Error();
            } else {
                res.status(200).json(task);
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    async update(req, res) {
        try {
            req.body.id = req.user.id;
            const taskId = req.params.id;
            const {title, description, deadline, categoryTitle, priorityColor, notificationTime, tagsTitleArray} = req.body;
            const category = await Category.findOne({where: {title: categoryTitle, userId: req.user.id}});
            const priority = await Priority.findOne({where: {color: priorityColor}});
            const notification = await Notification.findOne({where: {time: notificationTime}});
            const remindIn = calculateRemindIn(deadline, notificationTime);
            let task;

            if (!category) {
                task = await Task.update(
                    {
                        title,
                        description,
                        deadline,
                        remind_in: remindIn,
                        userId: req.user.id,
                        priorityId: priority.id,
                        notificationId: notification.id
                    },
                    {where: {id: taskId} });
            } else {
                task = await Task.update(
                    {
                        title,
                        description,
                        deadline,
                        remind_in: remindIn,
                        categoryId: category.id,
                        userId: req.user.id,
                        priorityId: priority.id,
                        notificationId: notification.id
                    },
                    {where: {id: taskId} });
            }

            await deleteOldTags(taskId);
            await addTagsToTask(taskId, tagsTitleArray);

            if (!task) {
                throw new Error();
            } else {
                const result = await Task.findOne({
                    where: {id: taskId},
                    include: [
                        {model: Priority},
                        {model: Category},
                        {model: Notification},
                        {model: Group},
                        {model: Tag, through: {attributes: []}}
                    ]
                });
                res.status(200).json(result);
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    async isDone(req, res) {
        try {
            req.body.id = req.user.id;
            const taskId = req.params.id;
            const {done} = req.body;

            const task = await Task.update(
                {is_done: done},
                {where: {id: taskId}}
            );

            if (!task) {
                throw new Error();
            } else {
                const result = await Task.findOne({
                    where: {id: taskId},
                    include: [
                        {model: Priority},
                        {model: Category},
                        {model: Notification},
                        {model: Group},
                        {model: Tag, through: {attributes: []}}
                    ]
                });
                res.status(200).json(result);
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    async delete(req, res) {
        try {
            const taskId = req.params.id;
            const task = await Task.destroy({where: {id: taskId}});
            if (!task) {
                throw new Error();
            } else {
                res.status(200).json({message: 'Задача удалена'});
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
}

module.exports = new TaskController();