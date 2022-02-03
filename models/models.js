const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    photo: {
        type: DataTypes.STRING
    }
});

const Task = sequelize.define('task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    is_done: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    },
    created_at: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    remind_in: {
        type: DataTypes.DATE
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

const Category = sequelize.define('category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    icon: {
        type: DataTypes.STRING
    }
});

const Group = sequelize.define('group', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const Priority = sequelize.define('priority', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const Notification = sequelize.define('notification', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    time: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const TaskTag = sequelize.define('task_tag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
});

const Tag = sequelize.define('tag', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

User.hasMany(Task);
Task.belongsTo(User);

User.hasMany(Category);
Category.belongsTo(User);

User.hasMany(Group);
Group.belongsTo(User);

User.hasMany(Tag);
Tag.belongsTo(User);

Category.hasMany(Task);
Task.belongsTo(Category);

Group.hasMany(Task);
Task.belongsTo(Group);

Priority.hasMany(Task);
Task.belongsTo(Priority);

Notification.hasMany(Task);
Task.belongsTo(Notification);

Task.belongsToMany(Tag, {through: TaskTag});
Tag.belongsToMany(Task, {through: TaskTag});

module.exports = {
    User,
    Task,
    Category,
    Group,
    Priority,
    Notification,
    TaskTag,
    Tag
}