import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

export const createComment = async (req, res) => {
  // Функция для создания комментария
  try {
    const { postId, comment } = req.body; // Получаем ID поста и текст комментария из тела запроса
    if (!comment) {
      // Проверяем, что комментарий не пустой
      return res.json({ message: 'Комментарий не может быть пустым' }); // Возвращаем ошибку, если комментарий пустой
    }
    const newComment = new Comment({
      // Создаем новый объект комментария
      comment,
      author: req.userId, // ID пользователя из middleware checkAuth
      postId, // ID поста
    });
    await newComment.save(); // Сохраняем комментарий в базе данных

    try {
      await Post.findByIdAndUpdate(postId, {
        // Обновляем пост, добавляя ID комментария в массив комментариев
        $push: { comments: newComment._id },
      });
    } catch (error) {
      console.error(error); // Выводим ошибку в консоль, если не удалось обновить пост
    }
    res.json(newComment); // Возвращаем созданный комментарий в ответе
  } catch (error) {
    res.json({ message: 'Что-то пошло не так' }); // Возвращаем сообщение об ошибке
    console.error(error); // Выводим ошибку в консоль
  }
};

// В controllers/comments.js
export const getPostComments = async (req, res) => {
  // Функция для получения комментариев к посту
  try {
    const comments = await Comment.find({ postId: req.params.id }) // Ищем комментарии по ID поста
      .populate('author', 'username') // Подгружаем информацию об авторе (только имя пользователя)
      .exec();
    res.json(comments); // Возвращаем комментарии в ответе
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении комментариев' }); // Возвращаем ошибку, если не удалось получить комментарии
  }
};
