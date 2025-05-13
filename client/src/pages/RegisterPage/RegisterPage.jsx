import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../redux/features/auth/authSlice';
import styles from './Register.module.scss';
const RegisterPage = () => {
  // Состояния для юзеров
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = () => {
    try {
      dispatch(registerUser({ username, password }));
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error(error);
    }
  };

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
              <form
                action=""
                className={styles.form}
                onSubmit={(e) => e.preventDefault()}
              >
                <h2>Регистрация</h2>
                <input
                  type="email"
                  placeholder="Email"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className={styles.btn}
                  type="submit"
                  onClick={handleSubmit}
                >
                  Создать
                </button>
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
