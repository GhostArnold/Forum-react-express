import { FcLike, FcLikePlaceholder } from 'react-icons/fc';
import { FaRegComment } from 'react-icons/fa';
import { IoMdArrowBack } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import { format } from 'date-fns';
import { Link, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removePost, likePost } from '../../redux/features/post/postSlice.js';
import { toast } from 'react-toastify';
import { BiSolidSend } from 'react-icons/bi';
import profile from '../../assets/img/profile.png';
import img from '../../assets/img/baobab.jpg';
import axios from '../../utils/axios.js';
import CommentItem from '../../components/CommentItem/CommentItem.jsx';
import styles from './PostPage.module.scss';
import {
  createComment,
  getPostComments,
} from '../../redux/features/comment/commentSlice.js';

const PostPage = () => {
  const [post, setPost] = useState(null); // Состояние для хранения данных поста
  const [comment, setComment] = useState(''); // Состояние для хранения текста комментария

  const { user } = useSelector((state) => state.auth); // Получаем данные пользователя из Redux
  const { comments, loading } = useSelector((state) => state.comment); // Получаем комментарии и состояние загрузки из Redux
  const params = useParams(); // Получаем параметры URL
  const dispatch = useDispatch(); // Получаем функцию dispatch из Redux
  const navigate = useNavigate(); // Получаем функцию navigate для переходов

  const removePostHadler = () => {
    // Обработчик удаления поста
    try {
      dispatch(removePost(params.id)); // Отправляем действие для удаления поста
      navigate('/'); // Перенаправляем на главную страницу
      toast('Пост был удалён'); // Выводим сообщение
    } catch (error) {
      console.error(error); // Выводим ошибку в консоль
    }
  };

  const handleLike = async () => {
    // Обработчик лайка
    try {
      if (!user) {
        toast('Для оценки поста необходимо авторизоваться'); // Выводим сообщение, если не авторизован
        return;
      }
      await dispatch(likePost(params.id)); // Отправляем действие для лайка
      const { data } = await axios.get(`/posts/${params.id}`); // Получаем обновленные данные поста
      setPost(data); // Обновляем состояние поста
    } catch (error) {
      console.error('Ошибка при лайке:', error); // Выводим ошибку в консоль
    }
  };

  const handleSubmit = () => {
    // Обработчик отправки комментария
    try {
      if (!comment.trim()) return; // Проверяем, что комментарий не пустой

      const postId = params.id; // Получаем ID поста
      dispatch(createComment({ postId, comment })).then(() => {
        // Отправляем действие для создания комментария
        setComment(''); // Очищаем поле ввода
        dispatch(getPostComments(postId)); // Получаем обновленные комментарии
      });
    } catch (error) {
      console.error(error); // Выводим ошибку в консоль
    }
  };

  const fetchComments = useCallback(async () => {
    // Функция для получения комментариев
    try {
      await dispatch(getPostComments(params.id)); // Отправляем действие для получения комментариев
    } catch (error) {
      console.error(error); // Выводим ошибку в консоль
    }
  }, [params.id, dispatch]);

  const fetchPost = useCallback(async () => {
    // Функция для получения данных поста
    try {
      const { data } = await axios.get(`/posts/${params.id}`); // Получаем данные поста по ID
      setPost(data); // Обновляем состояние поста
    } catch (error) {
      console.error(error); // Выводим ошибку в консоль
      navigate('/not-found'); // Перенаправляем на страницу "Не найдено"
    }
  }, [params.id, navigate]);

  useEffect(() => {
    // Получаем данные поста при монтировании компонента
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    // Получаем комментарии при монтировании компонента или изменении ID поста
    fetchComments();
  }, [fetchComments]);

  const formatDate = (dateString) => {
    // Функция для форматирования даты
    try {
      const date = new Date(dateString || new Date()); // Создаем объект Date
      return format(date, 'yyyy-MM-dd HH:mm'); // Форматируем дату
    } catch {
      return 'Дата неизвестна'; // Возвращаем строку, если произошла ошибка
    }
  };

  if (!post) {
    return <div className={styles.loading}>Загрузка...</div>; // Отображаем сообщение о загрузке, если пост не получен
  }

  return (
    <div>
      <main className={styles.main}>
        {/* Главный контейнер */}
        <article className={styles.post}>
          {/* Статья с информацией о посте */}
          <div className={styles.functions}>
            {/* Кнопки действий */}
            <div className={styles.btnBack}>
              {/* Кнопка "Назад" */}
              <Link to="/">
                <button>
                  <IoMdArrowBack />
                  Назад
                </button>
              </Link>
            </div>
            {user?._id === post?.author && (
              // Если текущий пользователь - автор поста
              <div className={styles.edit}>
                {/* Кнопки редактирования и удаления */}
                <MdDelete
                  className={styles.deleteBtn}
                  onClick={removePostHadler} // Обработчик удаления
                />
                <Link to={`/${params.id}/edit`}>
                  {/* Ссылка на страницу редактирования */}
                  <FaEdit className={styles.editBtn} />
                </Link>
              </div>
            )}
          </div>

          <div className={styles.user}>
            {/* Информация о пользователе */}
            <div className={styles.aboutUser}>
              {/* Аватар и имя пользователя */}
              <img src={profile} alt="Аватар" />
              <p>{post?.username || 'Неизвестный пользователь'}</p>
            </div>
            <div className={styles.views}>
              {/* Количество просмотров */}
              <p>Просмотры: {post?.views || 0}</p>
            </div>
          </div>

          <div className={styles.imgPost}>
            {/* Изображение поста */}
            {post?.imgUrl ? (
              <img
                src={`http://localhost:3002/${post.imgUrl}`} // Формируем URL
                alt="Изображение поста"
                onError={(e) => {
                  // Обработка ошибки загрузки изображения
                  e.target.onerror = null;
                  e.target.src = img; // Заменяем на заглушку
                }}
              />
            ) : (
              // Если нет URL, используем заглушку
              <img src={img} alt="Изображение поста" />
            )}
          </div>

          <div className={styles.content}>
            {/* Текст поста */}
            <p>{post?.text}</p>
          </div>

          <div className={styles.aboutPost}>
            {/* Информация о посте (лайки, комментарии, дата) */}
            <div className={styles.score}>
              {/* Лайки */}
              <div
                className={styles.like}
                onClick={handleLike} // Обработчик лайка
                style={{ cursor: 'pointer' }}
              >
                {post?.likes?.includes(user?._id) ? (
                  // Если пользователь лайкнул
                  <FcLike size={20} />
                ) : (
                  // Если не лайкнул
                  <FcLikePlaceholder size={20} />
                )}
                <span>{post?.likes?.length || 0}</span>{' '}
                {/* Количество лайков */}
              </div>
              <div className={styles.comment}>
                {/* Комментарии */}
                <FaRegComment />
                <span>{comments?.length || 0}</span>{' '}
                {/* Количество комментариев */}
              </div>
            </div>
            <div className={styles.createDate}>
              {/* Дата создания */}
              <p>{formatDate(post?.createdAt)}</p>
            </div>
          </div>

          <div className={styles.comments}>
            {/* Комментарии */}
            <h2>Комментарии ({comments?.length || 0}):</h2>

            {user && (
              // Если пользователь авторизован
              <form
                onSubmit={(e) => {
                  // Обработчик отправки формы
                  e.preventDefault(); // Предотвращаем перезагрузку
                  handleSubmit(); // Отправляем комментарий
                }}
              >
                <input
                  type="text"
                  placeholder="Напишите комментарий..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)} // Обновляем состояние комментария
                  disabled={loading} // Отключаем, если идет загрузка
                />
                <BiSolidSend
                  type="submit"
                  onClick={handleSubmit} // Обработчик отправки
                  className={styles.sendComment}
                  disabled={loading || !comment.trim()} // Отключаем, если идет загрузка или комментарий пустой
                />
              </form>
            )}

            {loading ? (
              // Если идет загрузка
              <div className={styles.loading}>Загрузка комментариев...</div>
            ) : comments?.length > 0 ? (
              // Если есть комментарии
              comments.map((cmt) => (
                // Отображаем каждый комментарий
                <CommentItem
                  key={cmt._id}
                  cmt={cmt}
                  currentUserId={user?._id}
                  postAuthorId={post?.author}
                />
              ))
            ) : (
              // Если нет комментариев
              <p className={styles.noComments}>Пока нет комментариев</p>
            )}
          </div>
        </article>
      </main>
    </div>
  );
};

export default PostPage;
