import { FcLikePlaceholder } from 'react-icons/fc';
import { FaRegComment } from 'react-icons/fa';
import { format } from 'date-fns';
import profile from '../../assets/img/profile.png';
import img from '../../assets/img/baobab.jpg';
import styles from './Post.module.scss';
import { Link } from 'react-router-dom';

const Post = ({ post }) => {
  if (!post) {
    return <div>Пост не существует</div>;
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'yyyy-MM-dd');
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
            <p>{post.views || 0}</p>
          </div>
        </div>
        <div className={styles.imgPost}>
          {post.imgUrl ? (
            <img src={`http://localhost:3002/${post.imgUrl}`} alt="Пост" />
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
          <div className={styles.like}>
            <FcLikePlaceholder />
          </div>
          <div className={styles.comment}>
            <FaRegComment />
          </div>
        </div>
        <div className={styles.createDate}>
          <p>{formatDate(post.createdAt)}</p>
        </div>
      </div>
    </article>
  );
};

export default Post;
