import stiker from '../../assets/img/stiker-text.png';
import styles from './MainPage.module.scss';
const MainPage = () => {
  return (
    <div>
      <header className={styles.header}>
        <div className={styles.main}>
          {/* Главный текст */}
          <div className={styles.main__title}>
            <h1>Веб-форум</h1>
          </div>
          {/* Девиз */}
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
    </div>
  );
};

export default MainPage;
