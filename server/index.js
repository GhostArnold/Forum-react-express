// Подключаем express
import express from 'express';
// Подключаем mongoose для БД
import mongoose from 'mongoose';
// Подключаем dotenv для env
import dotenv from 'dotenv';
// Подключаем cors
import cors from 'cors';
// Для загрузки картинок
import fileUpload from 'express-fileupload';
import authRoute from './routes/auth.js';
import postRoute from './routes/posts.js';
import commentRoute from './routes/comments.js';
// Создаём приложение
const app = express();
// Подключаем dotenv
dotenv.config();

// env переменные
const DB_PORT = process.env.DB_PORT || 3001;

// middlewares

// Чтобы отправлять запросы с разных айпи
app.use(cors());
// Чтобы отсылать данные в формате json
app.use(express.json());
// Для картинок
app.use(fileUpload());
app.use(express.static('./uploads/'));

// Router
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/comments', commentRoute);

try {
  await mongoose.connect('mongodb://localhost:27017/Forum_Diplom');
  // Запускаем сервер
  app.listen(DB_PORT, () => {
    console.log(`Server started on port ${DB_PORT}`);
  });
} catch (error) {
  console.error(error);
}
