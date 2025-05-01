import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    const salt = await bcrypt.genSalt(10); // Генерируем "соль" (дополнительная защита)
    const hash = await bcrypt.hash(password, salt); // Создаем хеш пароля

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
    // Берём username и password из req.body
    const { username, password } = req.body;
    // 2. Ищем пользователя в базе данных по username
    const user = await User.findOne({ username });
    // 3. Если пользователь не найден - возвращаем ошибку
    if (!user) {
      return res.json({
        message: 'Такого пользователя не существует',
      });
    }
    // 4. Сравниваем введённый пароль с хэшем из базы
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // 5. Если пароль не совпадает - возвращаем ошибку
    if (!isPasswordCorrect) {
      return res.json({
        message: 'Неверный пароль',
      });
    }

    // 6. Генерируем JWT-токен для аутентификации
    const token = jwt.sign(
      {
        id: user._id, // В payload токена записываем ID пользователя
      },
      process.env.JWT_SECRET, // Секретный ключ из переменных окружения
      { expiresIn: '30d' } // Срок действия токена - 30 дней
    );

    // 7. Отправляем успешный ответ с токеном и данными пользователя
    res.json({
      token, // Сгенерированный JWT-токен
      user, // Данные пользователя из базы
      message: 'Вы вошли в систему.', // Сообщение об успехе
    });
  } catch (error) {
    console.error(error);
    res.json({
      message: 'Ошибка при авторизации',
    });
  }
};

// Get Me - функция для получения данных текущего авторизованного пользователя
export const getMe = async (req, res) => {
  try {
    // 1. Получаем пользователя из базы данных по ID, который был сохранен в middleware checkAuth
    // req.userId содержит ID пользователя, который был извлечен из JWT-токена
    const user = await User.findById(req.userId);

    // 2. Проверяем, существует ли пользователь
    if (!user) {
      return res.json({
        message: 'Пользователь не найден',
      });
    }

    // 3. Генерируем новый JWT-токен для пользователя
    const token = jwt.sign(
      {
        id: user._id, // В payload токена включаем только ID пользователя
      },
      process.env.JWT_SECRET, // Используем секретный ключ из переменных окружения
      { expiresIn: '30d' } // Устанавливаем срок действия токена (30 дней)
    );

    // 4. Отправляем успешный ответ с данными пользователя и новым токеном
    res.json({
      user, // Возвращаем данные пользователя
      token, // Возвращаем новый токен (фронтенд должен его сохранить)
    });
  } catch (error) {
    // 5. Обрабатываем возможные ошибки
    console.error(error); // Логируем ошибку для отладки

    // Отправляем клиенту сообщение об ошибке с соответствующим HTTP-статусом
    res.status(500).json({
      message: 'Произошла ошибка при получении данных пользователя',
      error: error.message, // Можно включить детали ошибки (только для разработки!)
    });
  }
};
