import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
  {
    // Определение схемы для постов
    username: {
      // Имя пользователя, создавшего пост
      type: String,
      required: true, // Обязательное поле
    },
    title: {
      // Заголовок поста
      type: String,
      required: true, // Обязательное поле
    },
    text: {
      // Текст поста
      type: String,
      required: true, // Обязательное поле
    },
    imgUrl: {
      // URL изображения
      type: String,
      default: '', // Значение по умолчанию - пустая строка
    },
    views: {
      // Количество просмотров
      type: Number,
      default: 0, // Значение по умолчанию - 0
    },
    author: {
      // Ссылка на автора поста (ID пользователя)
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Ссылка на модель User
      required: true, // Обязательное поле
    },
    comments: [
      // Массив ссылок на комментарии
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment', // Ссылка на модель Comment
      },
    ],
    likes: [
      // Массив ссылок на пользователей, лайкнувших пост
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Ссылка на модель User
      },
    ],
    likesCount: {
      // Количество лайков
      type: Number,
      default: 0, // Значение по умолчанию - 0
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } } // Добавляем поля createdAt и updatedAt, а также включаем виртуальные поля в JSON и объекты
);

// Виртуальное поле для проверки лайка текущего пользователя
PostSchema.virtual('isLiked').get(function () {
  // Это будет устанавливаться в контроллере
  return this._isLiked || false; // Возвращаем значение виртуального поля, если оно установлено, иначе false
});

export default mongoose.model('Post', PostSchema); // Создаем модель Post на основе схемы
