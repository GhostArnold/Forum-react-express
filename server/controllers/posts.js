import Post from '../models/Post.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { containsBadWords } from '../utils/badWords.js';
// Create Post
export const createPost = async (req, res) => {
  try {
    const { title, text } = req.body;

    // Проверка на нецензурную лексику
    if (containsBadWords(title) || containsBadWords(text)) {
      return res.status(400).json({
        message: 'Пост содержит недопустимые слова',
        errorType: 'BAD_WORDS',
      });
    }

    const user = await User.findById(req.userId);

    if (req.files?.image) {
      // Исправлено: проверка на наличие именно image
      const fileName = Date.now().toString() + req.files.image.name; // Исправлено: image вместо images
      const __dirname = dirname(fileURLToPath(import.meta.url));
      await req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName));

      const newPostWithImage = new Post({
        username: user.username,
        title,
        text,
        imgUrl: fileName, // Исправлено: fileName вместо filename
        author: req.userId,
      });

      await newPostWithImage.save();
      await User.findByIdAndUpdate(req.userId, {
        // Исправлено: findByIdAndUpdate
        $push: { posts: newPostWithImage._id }, // Добавляем только ID поста
      });

      return res.json(newPostWithImage);
    }

    const newPostWithoutImage = new Post({
      username: user.username,
      title,
      text,
      imgUrl: '',
      author: req.userId,
    });

    await newPostWithoutImage.save();
    await User.findByIdAndUpdate(req.userId, {
      // Исправлено: findByIdAndUpdate
      $push: { posts: newPostWithoutImage._id }, // Добавляем только ID поста
    });

    return res.json(newPostWithoutImage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      // Добавлен статус ошибки
      message: 'Что-то пошло не так',
      error: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const { query } = req.query;
    let filter = {};

    if (query) {
      filter = {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { text: { $regex: query, $options: 'i' } },
        ],
      };
    }

    const posts = await Post.find(filter).sort('-createdAt');
    const popularPosts = await Post.find(filter).limit(5).sort('-views');

    res.json({ posts, popularPosts }); // Send both posts and popularPosts
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Что-то пошло не так' });
  }
};

export const getById = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true } // Возвращает обновленный документ
    );

    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Ошибка при получении поста',
      error: error.message,
    });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('posts'); // Используем populate

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json(user.posts); // Возвращаем уже заполненные посты
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Ошибка при получении постов',
      error: error.message,
    });
  }
};

// Удаление
export const removePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.json({ message: 'Такого поста не существует' });
    }

    await User.findByIdAndUpdate(req.userId, {
      $pull: { posts: req.params.id },
    });

    res.json({ message: 'Пост был удалён' }); // Возвращаем уже заполненные посты
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Ошибка при получении постов',
      error: error.message,
    });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const { title, text, id } = req.body;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    if (req.files?.image) {
      const fileName = Date.now().toString() + req.files.image.name;
      const __dirname = dirname(fileURLToPath(import.meta.url));
      await req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName));
      post.imgUrl = fileName || '';
    }

    post.title = title || post.title;
    post.text = text || post.text;

    await post.save();

    res.json({
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Ошибка при обновлении поста',
      error: error.message,
    });
  }
};

// Получение всех статей
export const getPostComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const list = await Promise.all((comment) => {
      return Comment.findById(comment);
    });
    res.json(list);
  } catch (error) {
    console.error(error);
  }
};

// Лайк поста
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    const userId = req.userId;
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex === -1) {
      // Добавляем лайк
      post.likes.push(userId);
      post.likesCount += 1;
    } else {
      // Удаляем лайк
      post.likes.splice(likeIndex, 1);
      post.likesCount -= 1;
    }

    await post.save();

    // Добавляем флаг isLiked для текущего пользователя
    const result = post.toObject();
    result.isLiked = post.likes.includes(userId);

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обработке лайка' });
    console.error(error);
  }
};

// Получение поста с информацией о лайке
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username avatarUrl')
      .populate('comments')
      .exec();

    if (!post) {
      return res.status(404).json({ message: 'Пост не найден' });
    }

    // Добавляем флаг isLiked если пользователь авторизован
    const result = post.toObject();
    if (req.userId) {
      result.isLiked = post.likes.includes(req.userId);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении поста' });
    console.error(error);
  }
};
