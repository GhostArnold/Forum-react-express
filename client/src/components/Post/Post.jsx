import { FcLike, FcLikePlaceholder } from 'react-icons/fc';
import { FaRegComment } from 'react-icons/fa';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { likePost } from '../../redux/features/post/postSlice';
import { toast } from 'react-toastify';
import profile from '../../assets/img/profile.png';
import img from '../../assets/img/baobab.jpg';
import styles from './Post.module.scss';

const Post = ({ post }) => {
  const dispatch = useDispatch(); // Получаем функцию dispatch из Redux
  const { user } = useSelector((state) => state.auth); // Получаем данные пользователя из Redux

  if (!post) {
    return <div>Пост не существует</div>; // Обработка случая, когда пост не найден
  }

  const handleLike = async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    e.stopPropagation(); // Останавливаем всплытие события

    try {
      if (!user) {
        toast('Для оценки поста необходимо авторизоваться'); // Выводим сообщение, если пользователь не авторизован
        return;
      }
      await dispatch(likePost(post._id)); // Отправляем действие для добавления/удаления лайка
    } catch (error) {
      console.error('Ошибка при лайке:', error); // Выводим сообщение об ошибке в консоль
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString || new Date()); // Создаем объект Date из строки или текущей даты
      return format(date, 'yyyy-MM-dd HH:mm'); // Форматируем дату
    } catch {
      return 'Дата неизвестна'; // Обрабатываем ошибку при форматировании даты
    }
  };

  return (
    <article className={styles.post}>
      {/* Ссылка на страницу поста */}
      <Link to={`/posts/${post._id}`} className={styles.postLink}>
        <div className={styles.user}>
          <div className={styles.aboutUser}>
            {/* Аватар пользователя */}
            <img src={profile} alt="Аватар" />
            {/* Имя пользователя */}
            <p>{post.username || 'Неизвестный пользователь'}</p>
          </div>
          <div className={styles.views}>
            {/* Количество просмотров */}
            <p>👀 {post.views || 0}</p>
          </div>
        </div>

        <div className={styles.title}>
          {/* Заголовок поста */}
          <h2>{post.title}</h2>
        </div>

        <div className={styles.imgPost}>
          {/* Изображение поста */}
          {post.imgUrl ? (
            <img
              src={`http://localhost:3002/${post.imgUrl}`} // Формируем URL изображения
              alt="Пост"
              onError={(e) => {
                // Обрабатываем ошибку загрузки изображения
                e.target.onerror = null;
                e.target.src = img; // Заменяем изображение на заглушку
              }}
            />
          ) : (
            // Если нет URL изображения, используем заглушку
            <img src={img} alt="Заглушка" />
          )}
        </div>

        <div className={styles.content}>
          {/* Текст поста */}
          <p>{post.text || 'Текст поста отсутствует'}</p>
        </div>
      </Link>

      <div className={styles.aboutPost}>
        <div className={styles.score}>
          {/* Лайки */}
          <div
            className={styles.like}
            onClick={handleLike} // Обработчик клика на лайк
            style={{ cursor: 'pointer' }}
          >
            {/* Отображаем лайк или "пустой" лайк в зависимости от того, лайкнул ли пользователь пост */}
            {post.likes?.includes(user?._id) ? (
              <FcLike size={20} />
            ) : (
              <FcLikePlaceholder size={20} />
            )}
            {/* Количество лайков */}
            <span>{post.likes?.length || 0}</span>
          </div>

          {/* Комментарии */}
          <Link
            to={`/posts/${post._id}#comments`} // Ссылка на комментарии
            className={styles.commentLink}
            onClick={(e) => e.stopPropagation()} // Останавливаем всплытие события
          >
            <div className={styles.comment}>
              {/* Иконка комментария */}
              <FaRegComment />
              {/* Количество комментариев */}
              <span>{post.commentsCount || post.comments?.length || 0}</span>
            </div>
          </Link>
        </div>

        <div className={styles.createDate}>
          {/* Дата создания */}
          <p>{formatDate(post.createdAt)}</p>
        </div>
      </div>
    </article>
  );
};

export default Post;
