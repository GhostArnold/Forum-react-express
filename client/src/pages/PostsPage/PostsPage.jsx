import { useEffect, useState } from 'react';
import axios from '../../utils/axios';
import Post from '../../components/Post/Post';
import styles from './PostsPage.module.scss';

const PostsPage = () => {
  const [posts, setPosts] = useState([]); // Состояние для хранения постов
  const [loading, setLoading] = useState(true); // Состояние для индикатора загрузки
  const [error, setError] = useState(null); // Состояние для хранения ошибки

  useEffect(() => {
    // Хук useEffect для загрузки постов при монтировании компонента
    axios
      .get('/posts/user/me') // Выполняем GET-запрос к API
      .then(({ data }) => setPosts(data)) // Обрабатываем успешный ответ, устанавливаем посты в состояние
      .catch((err) => setError(err.response?.data?.message || err.message)) // Обрабатываем ошибку, устанавливаем сообщение об ошибке
      .finally(() => setLoading(false)); // В любом случае (успех или ошибка) устанавливаем loading в false
  }, []); // Пустой массив зависимостей означает, что эффект выполнится только при монтировании

  return (
    <div>
      <main className={styles.main}>
        {/* Главный контейнер */}
        <section className={styles.list}>
          {/* Секция для отображения списка постов */}
          {loading && <div>Загрузка...</div>}
          {/* Отображаем индикатор загрузки, если loading === true */}
          {error && <div>Ошибка: {error}</div>}
          {/* Отображаем сообщение об ошибке, если error !== null */}
          {!loading &&
            !error && // Отображаем посты, если нет загрузки и нет ошибки
            (posts.length ? (
              // Если есть посты
              posts.map((post) => (
                // Отображаем каждый пост
                <Post post={post} key={post._id} className={styles.item} />
              ))
            ) : (
              // Если нет постов
              <div>У вас пока нет постов</div>
            ))}
        </section>
      </main>
    </div>
  );
};

export default PostsPage;
