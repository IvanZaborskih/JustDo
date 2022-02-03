const Router = require('express');
const router = new Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, categoryController.create);
router.get('/', authMiddleware, categoryController.getAll);
router.put('/:id', authMiddleware, categoryController.update);
router.delete('/:id', authMiddleware, categoryController.delete);

module.exports = router;
