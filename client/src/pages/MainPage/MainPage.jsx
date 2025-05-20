import { useSelector, useDispatch } from 'react-redux';
import stiker from '../../assets/img/stiker-text.png';
import kubok from '../../assets/img/kubok.png';
import Post from '../../components/Post/Post';
import PopularPost from '../../components/PopularPost/PopularPost';
import styles from './MainPage.module.scss';
import { useEffect } from 'react';
import { getAllPosts } from '../../redux/features/post/postSlice';

const MainPage = () => {
  const dispatch = useDispatch();
  const { posts, popularPosts } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

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
              {posts?.map((post) => (
                <Post key={post._id} post={post} />
              ))}
            </div>
          </div>
          <div className={styles.popularPosts}>
            <aside className={styles.popular}>
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
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainPage;
