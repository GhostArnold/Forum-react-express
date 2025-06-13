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
  // Функция для удаления поста
  try {
    const post = await Post.findByIdAndDelete(req.params.id); // Находим и удаляем пост по ID
    if (!post) {
      // Проверяем, что пост существует
      return res.json({ message: 'Такого поста не существует' }); // Возвращаем ошибку, если пост не найден
    }

    await User.findByIdAndUpdate(req.userId, {
      // Обновляем информацию о пользователе, удаляя ID поста из списка постов пользователя
      $pull: { posts: req.params.id },
    });

    res.json({ message: 'Пост был удалён' }); // Возвращаем сообщение об успешном удалении
  } catch (error) {
    console.error(error); // Выводим ошибку в консоль
    res.status(500).json({
      // Возвращаем ошибку сервера
      message: 'Ошибка при получении постов',
      error: error.message,
    });
  }
};

// Update post
export const updatePost = async (req, res) => {
  // Функция для обновления поста
  try {
    const { title, text, id } = req.body; // Получаем заголовок, текст и ID поста из тела запроса

    const post = await Post.findById(id); // Находим пост по ID
    if (!post) {
      // Проверяем, что пост существует
      return res.status(404).json({ message: 'Пост не найден' }); // Возвращаем ошибку, если пост не найден
    }

    if (req.files?.image) {
      // Если в запросе есть изображение
      const fileName = Date.now().toString() + req.files.image.name; // Создаем уникальное имя файла
      const __dirname = dirname(fileURLToPath(import.meta.url)); // Получаем текущую директорию
      await req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName)); // Перемещаем файл в папку uploads
      post.imgUrl = fileName || ''; // Обновляем URL изображения
    }

    post.title = title || post.title; // Обновляем заголовок, если он есть в запросе
    post.text = text || post.text; // Обновляем текст, если он есть в запросе

    await post.save(); // Сохраняем изменения

    res.json({
      // Возвращаем обновленный пост
      post,
    });
  } catch (error) {
    console.error(error); // Выводим ошибку в консоль
    res.status(500).json({
      // Возвращаем ошибку сервера
      message: 'Ошибка при обновлении поста',
      error: error.message,
    });
  }
};

// Получение всех статей
export const getPostComments = async (req, res) => {
  // Функция для получения комментариев поста
  try {
    const post = await Post.findById(req.params.id); // Находим пост по ID
    const list = await Promise.all((comment) => {
      // Получаем все комментарии
      return Comment.findById(comment);
    });
    res.json(list); // Возвращаем список комментариев
  } catch (error) {
    console.error(error); // Выводим ошибку в консоль
  }
};

// Лайк поста
export const likePost = async (req, res) => {
  // Функция для лайка поста
  try {
    const post = await Post.findById(req.params.id); // Находим пост по ID

    if (!post) {
      // Проверяем, что пост существует
      return res.status(404).json({ message: 'Пост не найден' }); // Возвращаем ошибку, если пост не найден
    }

    const userId = req.userId; // Получаем ID пользователя из запроса
    const likeIndex = post.likes.indexOf(userId); // Проверяем, лайкнул ли пользователь пост

    if (likeIndex === -1) {
      // Если пользователь не лайкнул пост
      post.likes.push(userId); // Добавляем ID пользователя в список лайков
      post.likesCount += 1; // Увеличиваем счетчик лайков
    } else {
      // Если пользователь уже лайкнул пост
      post.likes.splice(likeIndex, 1); // Удаляем ID пользователя из списка лайков
      post.likesCount -= 1; // Уменьшаем счетчик лайков
    }

    await post.save(); // Сохраняем изменения

    // Добавляем флаг isLiked для текущего пользователя
    const result = post.toObject();
    result.isLiked = post.likes.includes(userId);

    res.json(result); // Возвращаем обновленный пост
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обработке лайка' }); // Возвращаем ошибку сервера
    console.error(error); // Выводим ошибку в консоль
  }
};

// Получение поста с информацией о лайке
export const getPost = async (req, res) => {
  // Функция для получения информации о посте
  try {
    const post = await Post.findById(req.params.id) // Находим пост по ID
      .populate('author', 'username avatarUrl') // Подгружаем информацию об авторе
      .populate('comments') // Подгружаем комментарии
      .exec();

    if (!post) {
      // Проверяем, что пост существует
      return res.status(404).json({ message: 'Пост не найден' }); // Возвращаем ошибку, если пост не найден
    }

    // Добавляем флаг isLiked если пользователь авторизован
    const result = post.toObject();
    if (req.userId) {
      // Если пользователь авторизован
      result.isLiked = post.likes.includes(req.userId); // Проверяем, лайкнул ли пользователь пост
    }

    res.json(result); // Возвращаем информацию о посте
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении поста' }); // Возвращаем ошибку сервера
    console.error(error); // Выводим ошибку в консоль
  }
};
