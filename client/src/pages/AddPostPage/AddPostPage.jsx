import line from '../../assets/img/line.png';
import redPinning from '../../assets/img/red-pinning.png';
import styles from './AddPostPage.module.scss';
const AddPostPage = () => {
  return (
    <div>
      <div className={styles.main}>
        <div className={styles.wallpaper}>
          <form action="" className={styles.form}>
            <input type="file" />
            <label for="title">Заголовок поста: </label>
            <input id="title" type="text" placeholder="Заголовок" />
            <label for="textPost">Текст поста: </label>
            <textarea id="textPost" type="text" placeholder="Текст поста" />
            <button>Добавить</button>
            <button>Отменить</button>
            <img
              src={line}
              alt=""
              className={`${styles.line} ${styles.first}`}
            />
            <img
              src={line}
              alt=""
              className={`${styles.line} ${styles.second}`}
            />
            <img
              src={redPinning}
              alt=""
              className={`${styles.redPinning} ${styles.first}`}
            />
            <img
              src={redPinning}
              alt=""
              className={`${styles.redPinning} ${styles.second}`}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPostPage;
