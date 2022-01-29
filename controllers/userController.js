const {User} = require("../models/models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateJWT = (id, first_name, last_name, email) => {
    return jwt.sign(
        {id, first_name, last_name, email},
        process.env.SECRET_KEY,
        {}
    )
}

class UserController {
    async registration(req, res) {
        const {first_name, last_name, email, password, photo, confirmPassword} = req.body;
        if (!email || !password) {
            return res.status(404).json('Некорректный email или пароль');
        }
        const candidate = await User.findOne({where: {email}});
        if (candidate) {
            return res.status(404).json('Пользователь с таким email уже существует');
        }
        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({first_name, last_name, email, password: hashPassword, photo});
        const token = generateJWT(user.id, user.first_name, user.last_name, user.email);

        return res.json({token});
    }

    async login(req, res) {
        const {email, password} = req.body;
        const user = await User.findOne({where: {email}});
        if (!user) {
            return res.status(404).json('Пользователь с таким именем не найден');
        }
        let comparePassword = bcrypt.compareSync(password, user. password);
        if (!comparePassword) {
            return res.status(404).json('Указан неверный пароль');
        }
        const token = generateJWT(user.id, user.first_name, user.last_name, user.email);

        return res.json({token});
    }

    async check(req, res) {
        const token = generateJWT(req.user.id, req.user.first_name, req.user.last_name, req.user.email);
        return res.json({token});
    }
}

module.exports = new UserController();