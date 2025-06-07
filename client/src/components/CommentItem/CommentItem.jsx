import profile from '../../assets/img/profile.png'; // Или любой аватар по умолчанию
import styles from './CommentItem.module.scss';

const CommentItem = ({ cmt }) => {
  return (
    <div className={styles.commentItem}>
      <div className={styles.commentHeader}>
        <img
          src={cmt.author?.avatarUrl || profile}
          alt="Аватар"
          className={styles.commentAvatar}
        />
        <span className={styles.commentAuthor}>
          {cmt.author?.username || 'Аноним'}
        </span>
      </div>
      <div className={styles.commentText}>{cmt.comment}</div>
      {cmt.createdAt && (
        <div className={styles.commentDate}>
          {new Date(cmt.createdAt).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
