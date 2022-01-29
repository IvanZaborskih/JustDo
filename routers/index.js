const Router = require("express");
const router = new Router();
const userRouter = require("./userRouter");
const priorityRouter = require('./priorityRouter');

router.use('/user', userRouter);
router.use('/priority', priorityRouter);

module.exports = router;