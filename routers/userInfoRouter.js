const Router = require('express');
const router = new Router();
const multer = require('multer');
const userInfoController = require('../controllers/userInfoController');
const authMiddleware = require('../middleware/authMiddleware');
const fileMiddleware = require('../middleware/fileMiddleware');

router.get('/:id', authMiddleware, userInfoController.getOne);
router.put('/:id', authMiddleware, userInfoController.update);
router.put('/:id/change_photo', authMiddleware, fileMiddleware.single('avatar'), userInfoController.changePhoto);
router.put('/:id/change_password', authMiddleware, userInfoController.changePassword);
router.delete('/:id/delete_photo', authMiddleware, fileMiddleware.single('avatar'), userInfoController.deletePhoto);
router.delete('/:id', authMiddleware, userInfoController.delete);

module.exports = router;