const {User} = require('../models/models');
const bcrypt = require('bcrypt');

class UserInfoController {
    async getOne(req, res) {
        try {
            const userId = req.user.id;
            const user = await User.findByPk(userId);

            if (!user) {
                throw new Error();
            } else {
                res.json(user);
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    async update(req, res) {
        try {
            const userId = req.user.id;
            const {first_name, last_name, email} = req.body;
            const user = await User.update(
                {
                    first_name,
                    last_name,
                    email
                },
                {
                    where: {id: userId}
                });

            if (!user) {
                throw new Error();
            } else {
                const result = await User.findByPk(userId)
                res.status(200).json(result);
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    async changePhoto(req, res) {

    }

    async changePassword(req, res) {
        try {
            const {currentPassword, newPassword, confirmPassword} = req.body;
            const user = await User.findOne({where: {id: req.user.id}});

            if (bcrypt.compareSync(currentPassword, user.password)) {
                if (newPassword !== confirmPassword) {
                    return res.status(404).json({message: 'Пароли не совпадают'});
                } else {
                    const hashNewPassword = await bcrypt.hash(newPassword, 5);
                    await User.update(
                        {password: hashNewPassword},
                        {where: {id: req.user.id}}
                    );
                    return res.status(200).json({message: 'Пароль обновлен'});
                }
            } else {
                return res.status(404).json({message: 'Неверный текущий пароль'});
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }

    async delete(req, res) {
        try {
            const userId = req.params.id;
            const user = await User.destroy({where: {id: userId}});

            if (!user) {
                throw new Error();
            } else {
                res.json({message: 'Пользователь удален'});
            }
        } catch (err) {
            res.status(500).json({message: err.message});
        }
    }
}

module.exports = new UserInfoController();