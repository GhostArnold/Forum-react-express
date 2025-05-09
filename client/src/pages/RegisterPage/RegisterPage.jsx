import { Link } from 'react-router-dom';
import styles from './Register.module.scss';
const RegisterPage = () => {
  return (
    <div>
      <div className={styles.registerPage}>
        <article className={styles.register}>
          <section className={styles.sectionRegister}>
            <div className={styles.left}>
              <div className={styles.description}>
                <h3>Рады познакомиться!</h3>
                <p>Пожайлуста введите свои данные для создания аккаунта</p>
              </div>
            </div>
            <div className={styles.right}>
              <form action="" className={styles.form}>
                <h2>Регистрация</h2>
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button className={styles.btn}>Создать</button>
                <p className={styles.not_account}>
                  Уже есть аккаунт? <Link to="/login">Войти</Link>
                </p>
              </form>
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};

export default RegisterPage;
