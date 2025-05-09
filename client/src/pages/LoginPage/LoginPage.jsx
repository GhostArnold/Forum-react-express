import { Link } from 'react-router-dom';
import styles from './LoginPage.module.scss';
const LoginPage = () => {
  return (
    <div className={styles.loginPage}>
      <article className={styles.autorization}>
        <section className={styles.sectionAutorization}>
          <div className={styles.left}>
            <div className={styles.description}>
              <h3>Добро пожаловать!</h3>
              <p>Пожайлуста введите свои данные для входа в систему</p>
            </div>
          </div>
          <div className={styles.right}>
            <form action="" className={styles.form}>
              <h2>Авторизация</h2>
              <input type="email" placeholder="Email" />
              <input type="password" placeholder="Password" />
              <p>
                <a href="">Забыли пароль?</a>
              </p>
              <button className={styles.btn}>Войти</button>
              <p className={styles.not_account}>
                Нету акканута? <Link to="/register">Создать</Link>
              </p>
            </form>
          </div>
        </section>
      </article>
    </div>
  );
};

export default LoginPage;
