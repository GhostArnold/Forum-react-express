import { useSelector, useDispatch } from 'react-redux';
import stiker from '../../assets/img/stiker-text.png';
import kubok from '../../assets/img/kubok.png';
import Post from '../../components/Post/Post';
import PopularPost from '../../components/PopularPost/PopularPost';
import styles from './MainPage.module.scss';
import { useEffect, useState } from 'react';
import { getAllPosts } from '../../redux/features/post/postSlice';
import { setSearchQuery } from '../../redux/features/post/postSlice';

const MainPage = () => {
  const dispatch = useDispatch(); // Получаем функцию dispatch из Redux
  const { posts, popularPosts, loading, error, searchQuery } = useSelector(
    (state) => state.post
  ); // Получаем данные о постах, состоянии загрузки, ошибках и поисковом запросе из Redux
  const [localSearchQuery, setLocalSearchQuery] = useState(''); // Локальное состояние для поискового запроса

  useEffect(() => {
    // Получаем посты при изменении поискового запроса
    dispatch(getAllPosts({ query: searchQuery }));
  }, [dispatch, searchQuery]);

  const handleSearchChange = (e) => {
    // Обработчик изменения поискового запроса
    setLocalSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    // Обработчик отправки поискового запроса
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    dispatch(setSearchQuery(localSearchQuery)); // Обновляем поисковый запрос в Redux
  };

  return (
    <div>
      <header className={styles.header}>
        {/* Шапка сайта */}
        <div className={styles.mainHeader}>
          <div className={styles.text}>
            <div className={styles.main__title}>
              {/* Заголовок */}
              <h1>Веб-форум</h1>
            </div>
            <div className={styles.sub__title}>
              {/* Подзаголовок */}
              <h2>
                <span>Где рождаются идеи.</span> Общайтесь, творите и находите
                единомышленников. Вместе мы создаем что-то большее, чем каждый
                из нас по отдельности.
              </h2>
            </div>
          </div>

          <div className={styles.stiker}>
            {/* Стикер */}
            <img src={stiker} alt="" width="340px" height="320px" />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.posts}>
          {/* Секция с постами */}
          <div className={styles.allPosts}>
            <div className={styles.wallpaper}>
              {/* Отображение постов или сообщения о загрузке/ошибке */}
              {loading ? (
                <div>Loading posts...</div>
              ) : error ? (
                <div>Error: {error}</div>
              ) : (
                posts?.map((post) => (
                  <Post key={post._id} post={post} /> // Отображаем посты
                ))
              )}
            </div>
          </div>

          <aside className={styles.popularPosts}>
            {/* Сайдбар с популярными постами и поиском */}
            <div className={styles.popular}>
              {/* Блок популярных постов */}
              <div className={styles.kubok}>
                <img src={kubok} alt="Топ посты" />
              </div>
              <div className={styles.topList}>
                <ol>
                  {/* Отображение популярных постов */}
                  {popularPosts?.map((post, idx) => (
                    <li key={post._id || idx}>
                      <PopularPost post={post} />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className={styles.search}>
              {/* Блок поиска */}
              <form onSubmit={handleSearchSubmit}>
                {/* Форма поиска */}
                <div className={styles.filter}>
                  {/* Инпут для поиска */}
                  <input
                    type="text"
                    placeholder="Поиск по ключевым словам"
                    value={localSearchQuery}
                    onChange={handleSearchChange} // Обработчик изменения поискового запроса
                  />
                  <button type="submit" className={styles.btn}>
                    Найти
                  </button>{' '}
                  {/* Кнопка поиска */}
                </div>
                <div className={styles.reset}>
                  {/* Кнопка сброса фильтров */}
                  <button
                    type="button"
                    onClick={() => {
                      setLocalSearchQuery('');
                      dispatch(setSearchQuery(''));
                    }} // Сбрасываем поисковый запрос
                    className={styles.btn}
                  >
                    Обнулить фильтры
                  </button>
                </div>
              </form>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

export default MainPage;
