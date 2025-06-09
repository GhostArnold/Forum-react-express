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
  const dispatch = useDispatch();
  const { posts, popularPosts, loading, error, searchQuery } = useSelector(
    (state) => state.post
  );
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  useEffect(() => {
    dispatch(getAllPosts({ query: searchQuery }));
  }, [dispatch, searchQuery]);

  const handleSearchChange = (e) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearchQuery));
  };

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.mainHeader}>
          <div className={styles.main__title}>
            <h1>Веб-форум</h1>
          </div>
          <div className={styles.sub__title}>
            <h2>
              <span>Где рождаются идеи.</span> Общайтесь, творите и находите
              единомышленников. Вместе мы создаем что-то большее, чем каждый из
              нас по отдельности.
            </h2>
          </div>
          <div className={styles.stiker}>
            <img src={stiker} alt="" width="340px" height="320px" />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.posts}>
          <div className={styles.allPosts}>
            <div className={styles.wallpaper}>
              {loading ? (
                <div>Loading posts...</div>
              ) : error ? (
                <div>Error: {error}</div>
              ) : (
                posts?.map((post) => <Post key={post._id} post={post} />)
              )}
            </div>
          </div>

          <aside className={styles.popularPosts}>
            {/* Блок популярных постов */}
            <div className={styles.popular}>
              <div className={styles.kubok}>
                <img src={kubok} alt="Топ посты" />
              </div>
              <div className={styles.topList}>
                <ol>
                  {popularPosts?.map((post, idx) => (
                    <li key={post._id || idx}>
                      <PopularPost post={post} />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className={styles.search}>
              <form onSubmit={handleSearchSubmit}>
                <div className={styles.filter}>
                  <input
                    type="text"
                    placeholder="Поиск по ключевым словам"
                    value={localSearchQuery}
                    onChange={handleSearchChange}
                  />
                  <button type="submit" className={styles.btn}>
                    Найти
                  </button>
                </div>
                <div className={styles.reset}>
                  <button
                    type="button"
                    onClick={() => {
                      setLocalSearchQuery('');
                      dispatch(setSearchQuery(''));
                    }}
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
