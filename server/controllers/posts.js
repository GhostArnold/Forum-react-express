import Post from '../models/Post.js';
import User from '../models/User.js';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Create Post
export const createPost = async (req, res) => {
  try {
    const { title, text } = req.body;
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

// Get All Posts
export const getAll = async (req, res) => {
  try {
    const posts = await Post.find().sort('-createdAt');
    const popularPosts = await Post.find().limit(5).sort('-views');
    if (!posts) {
      return res.json({ message: 'Постов нет' });
    }
    res.json({ posts, popularPosts });
  } catch (error) {
    res.json({
      message: 'Что-то пошло не так',
    });
  }
};
