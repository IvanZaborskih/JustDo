const Router = require('express');
const router = new Router();
const userInfoController = require('../controllers/userInfoController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:id', authMiddleware, userInfoController.getOne);
router.put('/:id', authMiddleware, userInfoController.update);
router.put('/:id/change_photo', authMiddleware, userInfoController.changePhoto);
router.put('/:id/change_password', authMiddleware, userInfoController.changePassword);
router.delete('/:id', authMiddleware, userInfoController.delete);

module.exports = router;