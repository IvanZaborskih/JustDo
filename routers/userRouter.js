const Router = require("express");
const router = new Router();
const multer = require('multer');
const userController = require("../controllers/userController");
const authMiddleware = require('../middleware/authMiddleware');
const fileMiddleware = require('../middleware/fileMiddleware');

router.post('/registration', fileMiddleware.single('avatar'), userController.registration);
router.post('/login', userController.login);
router.get('/auth', authMiddleware, userController.check);

module.exports = router;