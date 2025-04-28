import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      // Тип данных строка
      type: String,
      //   Обязательность поля
      required: true,
      //   Уникальность
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    posts: [
      {
        // Тип - ObjectId (уникальный идентификатор MongoDB)
        type: mongoose.Schema.Types.ObjectId,
        // Связь с моделью Post
        ref: 'Post',
      },
    ],
  },
  //   автоматически добавляет:
  //   createdAt - дата создания
  //   updatedAt - дата последнего обновления
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
