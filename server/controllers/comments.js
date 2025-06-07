import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

export const createComment = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    if (!comment) {
      return res.json({ message: 'Комментарий не может быть пустым' });
    }
    const newComment = new Comment({
      comment,
      author: req.userId, // ID пользователя из checkAuth
      postId, // ID поста
    });
    await newComment.save();

    try {
      await Post.findByIdAndUpdate(postId, {
        $push: { comments: newComment._id },
      });
    } catch (error) {
      console.error(error);
    }
    res.json(newComment);
  } catch (error) {
    res.json({ message: 'Что-то пошло не так' });
    console.error(error);
  }
};

// В controllers/comments.js
export const getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id })
      .populate('author', 'username') // Добавьте это - подгружаем только имя пользователя
      .exec();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении комментариев' });
  }
};
