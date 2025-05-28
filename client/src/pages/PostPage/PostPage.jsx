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
import styles from './PostPage.module.scss';
import { createComment } from '../../redux/features/comment/commentSlice.js';

const PostPage = () => {
  const [post, setPost] = useState('');
  const [comment, setComment] = useState('');

  const { user } = useSelector((state) => state.auth);
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
      const postId = params.id;
      dispatch(createComment({ postId, comment }));
      setComment('');
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPost = useCallback(async () => {
    const { data } = await axios.get(`/posts/${params.id}`);
    setPost(data);
  }, [params.id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString || new Date());
      return format(date, 'yyyy-MM-dd');
    } catch {
      return 'Дата неизвестна';
    }
  };

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
              <img src={profile} alt="" />
              <p>{post?.username || 'Неизвестный пользователь'}</p>
            </div>
            <div className={styles.views}>
              <p>{post?.views || 0}</p>
            </div>
          </div>
          <div className={styles.imgPost}>
            {post?.imgUrl ? (
              <img src={`http://localhost:3002/${post.imgUrl}`} alt="" />
            ) : (
              <img src={img} alt="" />
            )}
          </div>
          <div className={styles.content}>
            {post?.text || (
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
                eius, quaerat placeat repudiandae veniam dolorem ex aspernatur
                sed explicabo neque corrupti voluptate quos deserunt sequi
                voluptates dolores repellat nisi delectus consequuntur tempore
                ab ullam illum.
              </p>
            )}
          </div>
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
              <p>{formatDate(post?.createdAt)}</p>
            </div>
          </div>

          {/* {user?._id === post?.author && (
            <div className={styles.edit}>
              <MdDelete />
              <FaEdit />
            </div>
          )} */}
          <div className={styles.comments}>
            <h2>Комментарии: </h2>
            <form action="" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Напишите комментарий..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <BiSolidSend
                type="submit"
                onClick={handleSubmit}
                className={styles.sendComment}
              />
            </form>
          </div>
        </article>
      </main>
    </div>
  );
};

export default PostPage;
