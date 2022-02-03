const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const tagRouter = require('./tagRouter');
const groupRouter = require('./groupRouter');
const categoryRouter = require('./categoryRouter');
const taskRouter = require('./taskRouter');

router.use('/user', userRouter);
router.use('/tag', tagRouter);
router.use('/group', groupRouter);
router.use('/category', categoryRouter);
router.use('/task', taskRouter);

module.exports = router;