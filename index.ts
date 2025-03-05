import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import pkg from 'body-parser';
const { json } = pkg;

import ApiRouter from './routes/ApiRouter.ts';
import cookieParser from 'cookie-parser';
import http from 'http';
import mongoose from 'mongoose';
import { errorHandler } from './middlewares/error/ErrorHandler.ts';
import 'dotenv/config';
const app: Application = express();

const server = http.createServer(app);

const port: number = 8800;
app.use(json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', ApiRouter);
app.use((err: Error, req: Request, res: Response): void => {
  errorHandler(err, res);
});

server.listen(port, () => {
  mongoose
    .connect(`${process.env.MONGO_URI}/countryDB`)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('MongoDB Connection Error:', err));
  console.log(`Server Running here 👉 http://localhost:${port}`);
});
