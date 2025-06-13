import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.scss';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { checkIsAuth, loginUser } from '../../redux/features/auth/authSlice';

const LoginPage = () => {
  const [username, setUsername] = useState(''); // Состояние для имени пользователя
  const [password, setPassword] = useState(''); // Состояние для пароля

  const { status } = useSelector((state) => state.auth); // Получаем статус из Redux
  const isAuth = useSelector(checkIsAuth); // Проверяем, авторизован ли пользователь
  const dispatch = useDispatch(); // Получаем функцию dispatch из Redux
  const navigate = useNavigate(); // Получаем функцию navigate для переходов

  useEffect(() => {
    // Эффект при изменении статуса или авторизации
    if (status) {
      toast(status); // Отображаем сообщение
    }
    if (isAuth) {
      navigate('/'); // Перенаправляем на главную страницу, если авторизован
    }
  }, [status, isAuth, navigate]);

  const onSubmitHandler = () => {
    // Обработчик отправки формы
    try {
      dispatch(loginUser({ username, password })); // Отправляем данные для входа
      setUsername(''); // Очищаем имя пользователя
      setPassword(''); // Очищаем пароль
    } catch (error) {
      console.error(error); // Выводим ошибку в консоль
    }
  };

  return (
    <div className={styles.loginPage}>
      <article className={styles.autorization}>
        <section className={styles.sectionAutorization}>
          <div className={styles.left}>
            <div className={styles.description}>
              {/* Описание */}
              <h3>Добро пожаловать!</h3>
              <p>Пожайлуста введите свои данные для входа в систему</p>
            </div>
          </div>
          <div className={styles.right}>
            {/* Форма входа */}
            <form
              action=""
              className={styles.form}
              onSubmit={(e) => e.preventDefault()} // Предотвращаем отправку формы по умолчанию
            >
              <h2>Авторизация</h2>
              <input
                type="email"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)} // Обновляем имя пользователя
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Обновляем пароль
              />
              <p></p>
              <button
                type="submit"
                className={styles.btn}
                onClick={onSubmitHandler} // Обработчик отправки формы
              >
                Войти
              </button>
              <p className={styles.not_account}>
                {/* Ссылка на регистрацию */}
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
