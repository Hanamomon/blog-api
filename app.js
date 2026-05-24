import express from 'express';
import postRouter from './routes/postRouter.js';
import userRouter from './routes/userRouter.js';

const app = express();

app.use(express.json());

app.use('/posts', postRouter);
app.use('/users', userRouter);

app.listen(3000);