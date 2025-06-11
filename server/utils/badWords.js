export const badWordsList = ['плохо'];

export const containsBadWords = (text) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  return badWordsList.some((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lowerText);
  });
};
