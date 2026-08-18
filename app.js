import express from "express";
import postRouter from "./routes/postRouter.js";
import userRouter from "./routes/userRouter.js";
import errorHandler from "./middlewares/errorMiddleware.js";
import AppError from "./helpers/appError.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.API_URL,
    optionsSuccessStatus: 200,
  }),
);

app.use(express.json());

app.use("/posts", postRouter);
app.use("/users", userRouter);

app.all("{*splat}", (req, res, next) => {
  throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
});

app.use(errorHandler);

app.listen(3000);
