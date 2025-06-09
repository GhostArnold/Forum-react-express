// utils/badWords.js

export const badWordsList = ['плохо'];

// Улучшенная функция проверки (только целые слова)
export const containsBadWords = (text) => {
  if (!text) return false;

  const words = text.toLowerCase().split(/\s+/);
  return badWordsList.some((badWord) => words.includes(badWord));
};

// Улучшенная функция поиска плохих слов (только целые слова)
export const getBadWordsFound = (text) => {
  if (!text) return [];

  const words = text.toLowerCase().split(/\s+/);
  return badWordsList.filter((badWord) => words.includes(badWord));
};
