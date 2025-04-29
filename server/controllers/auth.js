import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Register User
// req - то, что приходит нам со стороны клиента
// res - отправка ответа в клиент от бекенда

// Обработчик регистрации пользователя (асинхронная функция)
export const register = async (req, res) => {
  try {
    // 1. Получаем данные из тела запроса
    const { username, password } = req.body;

    // 2. Проверяем, не занят ли username
    const isUsed = await User.findOne({ username });

    // 3. Если пользователь уже существует - возвращаем ошибку
    if (isUsed) {
      return res.json({
        message: 'Данный username уже занят',
      });
    }

    // 4. Хешируем пароль для безопасного хранения
    const salt = bcrypt.genSaltSync(10); // Генерируем "соль" (дополнительная защита)
    const hash = bcrypt.hashSync(password, salt); // Создаем хеш пароля

    // 5. Создаем нового пользователя
    const newUser = new User({
      username,
      password: hash, // Сохраняем хеш вместо чистого пароля
    });

    // 6. Сохраняем пользователя в базу данных
    await newUser.save();

    // 7. Отправляем успешный ответ с данными нового пользователя
    res.json({
      newUser, // Можно заменить на newUser.toObject(), чтобы убрать служебные поля
      message: 'Регистрация прошла успешно',
    });
  } catch (error) {
    // 8. Обрабатываем возможные ошибки
    console.error(error); // Логируем ошибку для отладки
    res.json({
      message: 'Ошибка при создании пользователя',
      // Можно добавить больше деталей: error: error.message
    });
  }
};
// Login User
export const login = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
  }
};
// Get Me
export const getMe = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
  }
};
