// Подключаем express
import express from 'express';
// Подключаем mongoose для БД
import mongoose from 'mongoose';
// Подключаем dotenv для env
import dotenv from 'dotenv';
// Подключаем cors
import cors from 'cors';

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

app.get('/', (req, res) => {
  res.json({ message: 'All is Fine' });
});

try {
  await mongoose.connect('mongodb://localhost:27017');
  // Запускаем сервер
  app.listen(DB_PORT, () => {
    console.log(`Server started on port ${DB_PORT}`);
  });
} catch (error) {
  console.error(error);
}
