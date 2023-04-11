const express = require("express");
const app = express();
const path = require("path")
const { connectdb } = require("./DB/connect");
const indexRouter = require('./allrouter');
require('dotenv').config();
app.use(express.json());
app.use('/api/v1/user', indexRouter.userRouter);
app.use('/api/v1/post', indexRouter.postRouter);
app.use("/api/v1/comment", indexRouter.commentRouter)
app.use('/api/v1/uploads', express.static(path.join(__dirname, './uploads')))
connectdb();
app.listen(process.env.PORT, () => {
    console.log("good job");
});