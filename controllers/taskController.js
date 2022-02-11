const {Task, Category, Priority, Group, Notification, Tag, TaskTag} = require('../models/models');
const {Op} = require("sequelize");

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

const findAllTasksWithFilter = async (userId, sortOption) => {
    return await Task.findAll({
        where: {userId},
        order: [[sortOption, 'ASC']],
        include: [
            {model: Priority},
            {model: Category},
            {model: Notification},
            {model: Group},
            {model: Tag, through: {attributes: []}}
        ]
    });
}

const findTasksWithCategoryFilter = async (userId, sortOption, categoryId) => {
    return await Task.findAll({
        where: {userId, categoryId},
        order: [[sortOption, 'ASC']],
        include: [{model: Priority}, {model: Category}, {model: Notification}, {model: Group}, {
            model: Tag,
            through: {attributes: []}
        }]
    });
}

const findTasksWithTagFilter = async (userId, sortOption, tagId) => {
    return await Task.findAll({
        where: {userId},
        include: [{model: Priority}, {model: Category}, {model: Notification}, {model: Group},
            {
                model: Tag, through: {attributes: []},
                where: {id: tagId}
            }
        ],
        order: [[sortOption, 'ASC']],
    });
}

const findTasksWithCategoryAndTag = async (userId, sortOption, categoryId, tagId) => {
    return await Task.findAll({
        where: {userId},
        include: [{model: Priority}, {model: Notification}, {model: Group},
            {
                model: Category,
                where: {id: categoryId}
            },
            {
                model: Tag, through: {attributes: []},
                where: {id: tagId}
            }
        ],
        order: [[sortOption, 'ASC']],
    });
}

const findTasksByTitle = async (userId, searchTitle) => {
    return await Task.findAll({
        where: {userId, title: searchTitle},
        include: [
            {model: Priority},
            {model: Category},
            {model: Notification},
            {model: Group},
            {model: Tag, through: {attributes: []}}
        ]
    });
}

const findTasksByDate = async (userId, startDay, endDay) => {
    return await Task.findAll({
        where: {
            userId,
            deadline: {[Op.between] : [startDay, endDay]}
        },
        include: [
            {model: Priority},
            {model: Category},
            {model: Notification},
            {model: Group},
            {model: Tag, through: {attributes: []}}
        ]
    });
}


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
            let {categoryId, tagId, sortOption, searchTitle, searchDate} = req.query;
            let tasks;
            if (!sortOption) {
                sortOption = 'deadline';
            }

            if (!categoryId && !tagId) {
                tasks = await findAllTasksWithFilter(userId, sortOption);
            } else if (categoryId && !tagId) {
                tasks = await findTasksWithCategoryFilter(userId, sortOption, categoryId);
            } else if (!categoryId && tagId) {
                tasks = await findTasksWithTagFilter(userId, sortOption, tagId);
            } else if (categoryId && tagId) {
                tasks = await findTasksWithCategoryAndTag(userId, sortOption, categoryId, tagId);
            }

            if (searchTitle) {
                tasks = await findTasksByTitle(userId, searchTitle);
            } else if (searchDate) {
                const timeZoneDifference = 10800000;
                const dayInMs = 86399999;
                let startDay = Date.parse(searchDate) - timeZoneDifference;
                let endDay = startDay + dayInMs;
                startDay = new Date(startDay);
                endDay = new Date(endDay);

                tasks = await findTasksByDate(userId, startDay, endDay);
            }

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

    async addGroup(req, res) {
        try {
            const taskId = req.params.id;
            const {groupId} = req.body;

            const task = await Task.update(
                {groupId: groupId},
                {where: {id: taskId}}
            )

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