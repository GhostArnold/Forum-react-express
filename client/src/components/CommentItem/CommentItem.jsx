import profile from '../../assets/img/profile.png'; // Или любой аватар по умолчанию
import styles from './CommentItem.module.scss';

const CommentItem = ({ cmt }) => {
  return (
    <div className={styles.commentItem}>
      {/* Заголовок комментария, содержащий аватар и имя автора */}
      <div className={styles.commentHeader}>
        {/* Аватар автора комментария.  Если у автора есть avatarUrl, то используется он, иначе используется аватар по умолчанию */}
        <img
          src={cmt.author?.avatarUrl || profile}
          alt="Аватар"
          className={styles.commentAvatar}
        />
        {/* Имя автора комментария. Если у автора есть имя пользователя, то используется оно, иначе отображается "Аноним" */}
        <span className={styles.commentAuthor}>
          {cmt.author?.username || 'Аноним'}
        </span>
      </div>
      {/* Текст комментария */}
      <div className={styles.commentText}>{cmt.comment}</div>
      {/* Дата и время создания комментария. Отображаются, если поле createdAt существует */}
      {cmt.createdAt && (
        <div className={styles.commentDate}>
          {/* Форматирование даты и времени в локализованный формат */}
          {new Date(cmt.createdAt).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
