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
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  if (!post) {
    return <div>Пост не существует</div>;
  }

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (!user) {
        toast('Для оценки поста необходимо авторизоваться');
        return;
      }
      await dispatch(likePost(post._id));
    } catch (error) {
      console.error('Ошибка при лайке:', error);
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString || new Date());
      return format(date, 'yyyy-MM-dd HH:mm');
    } catch {
      return 'Дата неизвестна';
    }
  };

  return (
    <article className={styles.post}>
      <Link to={`/posts/${post._id}`} className={styles.postLink}>
        <div className={styles.user}>
          <div className={styles.aboutUser}>
            <img src={profile} alt="Аватар" />
            <p>{post.username || 'Неизвестный пользователь'}</p>
          </div>
          <div className={styles.views}>
            <p>👀 {post.views || 0}</p>
          </div>
        </div>

        <div className={styles.title}>
          <h2>{post.title}</h2>
        </div>

        <div className={styles.imgPost}>
          {post.imgUrl ? (
            <img
              src={`http://localhost:3002/${post.imgUrl}`}
              alt="Пост"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = img;
              }}
            />
          ) : (
            <img src={img} alt="Заглушка" />
          )}
        </div>

        <div className={styles.content}>
          <p>{post.text || 'Текст поста отсутствует'}</p>
        </div>
      </Link>

      <div className={styles.aboutPost}>
        <div className={styles.score}>
          <div
            className={styles.like}
            onClick={handleLike}
            style={{ cursor: 'pointer' }}
          >
            {post.likes?.includes(user?._id) ? (
              <FcLike size={20} />
            ) : (
              <FcLikePlaceholder size={20} />
            )}
            <span>{post.likes?.length || 0}</span>
          </div>

          <Link
            to={`/posts/${post._id}#comments`}
            className={styles.commentLink}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.comment}>
              <FaRegComment />
              <span>{post.commentsCount || post.comments?.length || 0}</span>
            </div>
          </Link>
        </div>

        <div className={styles.createDate}>
          <p>{formatDate(post.createdAt)}</p>
        </div>
      </div>
    </article>
  );
};

export default Post;
