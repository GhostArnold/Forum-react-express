import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
  // Извлекаем токен из заголовка `Authorization`, удаляя префикс 'Bearer '
  // Пример: 'Bearer eyJhbGci...' → 'eyJhbGci...'
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  // Если токен передан, проверяем его валидность
  if (token) {
    try {
      // Расшифровываем токен и проверяем его подпись с помощью JWT_SECRET
      // decoded — это payload токена (в вашем случае { id: '...' })
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Добавляем ID пользователя в объект запроса (req)
      // Теперь он будет доступен в следующих middleware и роутах
      req.userId = decoded.id;

      // Передаём управление следующему middleware/контроллеру
      next();
    } catch (error) {
      // Ошибка: токен невалиден (просрочен, подделан и т.д.)
      res.status(401).json({ message: 'Нет доступа' });
    }
  } else {
    // Ошибка: токен не передан
    res.status(401).json({ message: 'Нет доступа' });
  }
};
