import { FcLikePlaceholder } from 'react-icons/fc';
import { FaRegComment } from 'react-icons/fa';
import { IoMdArrowBack } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { FaEdit } from 'react-icons/fa';
import { format } from 'date-fns';
import { Link, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removePost } from '../../redux/features/post/postSlice.js';
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
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');

  const { user } = useSelector((state) => state.auth);
  const { comments, loading } = useSelector((state) => state.comment);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const removePostHadler = () => {
    try {
      dispatch(removePost(params.id));
      navigate('/');
      toast('Пост был удалён');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = () => {
    try {
      if (!comment.trim()) return;

      const postId = params.id;
      dispatch(createComment({ postId, comment })).then(() => {
        setComment('');
        // Обновляем комментарии после успешного добавления
        dispatch(getPostComments(postId));
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComments = useCallback(async () => {
    try {
      await dispatch(getPostComments(params.id));
    } catch (error) {
      console.error(error);
    }
  }, [params.id, dispatch]);

  const fetchPost = useCallback(async () => {
    try {
      const { data } = await axios.get(`/posts/${params.id}`);
      setPost(data);
    } catch (error) {
      console.error(error);
      navigate('/not-found');
    }
  }, [params.id, navigate]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString || new Date());
      return format(date, 'yyyy-MM-dd HH:mm');
    } catch {
      return 'Дата неизвестна';
    }
  };

  if (!post) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div>
      <main className={styles.main}>
        <article className={styles.post}>
          <div className={styles.functions}>
            <div className={styles.btnBack}>
              <Link to="/">
                <button>
                  <IoMdArrowBack />
                  Назад
                </button>
              </Link>
            </div>
            {user?._id === post?.author && (
              <div className={styles.edit}>
                <MdDelete
                  className={styles.deleteBtn}
                  onClick={removePostHadler}
                />
                <Link to={`/${params.id}/edit`}>
                  <FaEdit className={styles.editBtn} />
                </Link>
              </div>
            )}
          </div>

          <div className={styles.user}>
            <div className={styles.aboutUser}>
              <img src={profile} alt="Аватар" />
              <p>{post?.username || 'Неизвестный пользователь'}</p>
            </div>
            <div className={styles.views}>
              <p>Просмотры: {post?.views || 0}</p>
            </div>
          </div>

          <div className={styles.imgPost}>
            {post?.imgUrl ? (
              <img
                src={`http://localhost:3002/${post.imgUrl}`}
                alt="Изображение поста"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = img;
                }}
              />
            ) : (
              <img src={img} alt="Изображение поста" />
            )}
          </div>

          <div className={styles.content}>
            <p>{post?.text}</p>
          </div>

          <div className={styles.aboutPost}>
            <div className={styles.score}>
              <div className={styles.like}>
                <FcLikePlaceholder />
                <span>{post?.likes?.length || 0}</span>
              </div>
              <div className={styles.comment}>
                <FaRegComment />
                <span>{comments?.length || 0}</span>
              </div>
            </div>
            <div className={styles.createDate}>
              <p>{formatDate(post?.createdAt)}</p>
            </div>
          </div>

          <div className={styles.comments}>
            <h2>Комментарии ({comments?.length || 0}):</h2>

            {user && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <input
                  type="text"
                  placeholder="Напишите комментарий..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={loading}
                />
                <BiSolidSend
                  type="submit"
                  onClick={handleSubmit}
                  className={styles.sendComment}
                  disabled={loading || !comment.trim()}
                />
              </form>
            )}

            {loading ? (
              <div className={styles.loading}>Загрузка комментариев...</div>
            ) : comments?.length > 0 ? (
              comments.map((cmt) => (
                <CommentItem
                  key={cmt._id}
                  cmt={cmt}
                  currentUserId={user?._id}
                  postAuthorId={post?.author}
                />
              ))
            ) : (
              <p className={styles.noComments}>Пока нет комментариев</p>
            )}
          </div>
        </article>
      </main>
    </div>
  );
};

export default PostPage;
