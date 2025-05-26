import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import Post from '../../components/Post/Post';
import styles from './PostsPage.module.scss';

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('/posts/user/me')
      .then(({ data }) => setPosts(data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <main className={styles.main}>
        <section className={styles.list}>
          {loading && <div>Загрузка...</div>}
          {error && <div>Ошибка: {error}</div>}
          {!loading &&
            !error &&
            (posts.length ? (
              posts.map((post) => (
                <Post post={post} key={post._id} className={styles.item} />
              ))
            ) : (
              <div>У вас пока нет постов</div>
            ))}
        </section>
      </main>
    </div>
  );
};

export default PostsPage;
