import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    // Определение схемы для комментариев
    comment: {
      // Текст комментария
      type: String,
      require: true, // Обязательное поле
    },
    author: {
      // Ссылка на автора комментария (ID пользователя)
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Ссылка на модель User
    },
    postId: {
      // <-- Добавьте это поле
      // Ссылка на пост, к которому относится комментарий
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post', // Ссылка на модель Post
      required: true, // Обязательное поле
    },
  },
  { timestamps: true } // Добавляем поля createdAt и updatedAt
);

export default mongoose.model('Comment', CommentSchema); // Создаем модель Comment на основе схемы
