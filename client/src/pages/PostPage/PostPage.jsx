import { FcLikePlaceholder } from 'react-icons/fc';
import { FaRegComment } from 'react-icons/fa';
import { IoMdArrowBack } from 'react-icons/io';
import { format } from 'date-fns';
import { Link, useParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import profile from '../../assets/img/profile.png';
import img from '../../assets/img/baobab.jpg';
import axios from '../../utils/axios.js';
import styles from './PostPage.module.scss';

const PostPage = () => {
  const [post, setPost] = useState(null);
  const params = useParams();

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
          <div className={styles.btnBack}>
            <Link to="/">
              <button>
                <IoMdArrowBack />
                Назад
              </button>
            </Link>
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
        </article>
      </main>
    </div>
  );
};

export default PostPage;
