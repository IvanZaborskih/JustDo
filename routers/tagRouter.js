const Router = require("express");
const router = new Router();
const tagController = require("../controllers/tagController");
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, tagController.create);
router.get('/', authMiddleware, tagController.getAll);
router.put('/:id', authMiddleware, tagController.update);
router.delete('/:id', authMiddleware, tagController.delete);

module.exports = router;