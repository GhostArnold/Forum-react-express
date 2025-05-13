import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/features/auth/authSlice';
import styles from './Register.module.scss';
// Для отображения окна с ошибкой или успехом
import { toast } from 'react-toastify';
// Очистка статуса
import { clearStatus } from '../../redux/features/auth/authSlice';

const RegisterPage = () => {
  // Состояния для юзеров
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { status } = useSelector((state) => state.auth);
  console.log(status);
  const dispatch = useDispatch();

  // useEffect срабатывает при изменении зависимости -
  //  в этом, при изменении значения status.
  useEffect(() => {
    if (status) {
      // Показываем уведомление только при изменении статуса
      toast(status);
      dispatch(clearStatus());
    }
    // В useEffect рекомендуется добавлять dispatch в массив зависимостей, потому что линтер React (например, ESLint с плагином для хуков) требует, чтобы все внешние переменные, используемые внутри эффекта, были указаны в зависимостях.
  }, [status, dispatch]);

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
