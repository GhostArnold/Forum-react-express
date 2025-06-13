export const badWordsList = ['плохо']; // Список запрещенных слов

export const containsBadWords = (text) => {
  // Функция для проверки текста на наличие запрещенных слов
  if (!text) return false; // Если текста нет, возвращаем false
  const lowerText = text.toLowerCase(); // Приводим текст к нижнему регистру
  return badWordsList.some((word) => {
    // Проверяем, содержит ли текст хотя бы одно запрещенное слово
    const regex = new RegExp(`\\b${word}\\b`, 'i'); // Создаем регулярное выражение для поиска слова целиком (без учета регистра)
    return regex.test(lowerText); // Проверяем, соответствует ли текст регулярному выражению
  });
};
