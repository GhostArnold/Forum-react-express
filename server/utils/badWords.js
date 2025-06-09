export const badWordsList = [
  'хуй',
  'пизда',
  'ебал',
  'бля',
  'блядь',
  'ебан',
  'сука',
  'гондон',
  'мудак',
  'залупа',
  'пидор',
  'долбоеб',
  'охереть',
  'охуеть',
  // Добавьте другие слова
];

export const containsBadWords = (text) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return badWordsList.some((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });
};
