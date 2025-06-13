import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkIsAuth, registerUser } from '../../redux/features/auth/authSlice';
import styles from './Register.module.scss';
import { toast } from 'react-toastify'; // Для отображения уведомлений
import { clearStatus } from '../../redux/features/auth/authSlice'; // Для очистки статуса

const RegisterPage = () => {
  const [username, setUsername] = useState(''); // Состояние для имени пользователя
  const [password, setPassword] = useState(''); // Состояние для пароля
  const { status } = useSelector((state) => state.auth); // Получаем статус из Redux
  const isAuth = useSelector(checkIsAuth); // Проверяем, авторизован ли пользователь
  console.log(status);
  const dispatch = useDispatch(); // Получаем функцию dispatch из Redux
  const navigate = useNavigate(); // Получаем функцию navigate для переходов

  useEffect(() => {
    // Эффект при изменении статуса или авторизации
    if (status) {
      toast(status); // Отображаем уведомление
      dispatch(clearStatus()); // Очищаем статус
    }
    if (isAuth) {
      navigate('/'); // Перенаправляем на главную, если авторизован
    }
  }, [status, dispatch, isAuth, navigate]); // Зависимости эффекта

  const handleSubmit = () => {
    // Обработчик отправки формы
    try {
      dispatch(registerUser({ username, password })); // Отправляем данные на регистрацию
      setUsername(''); // Очищаем имя пользователя
      setPassword(''); // Очищаем пароль
    } catch (error) {
      console.error(error); // Выводим ошибку в консоль
    }
  };

  return (
    <div>
      <div className={styles.registerPage}>
        {/* Главный контейнер */}
        <article className={styles.register}>
          <section className={styles.sectionRegister}>
            <div className={styles.left}>
              {/* Левая часть */}
              <div className={styles.description}>
                {/* Описание */}
                <h3>Рады познакомиться!</h3>
                <p>Пожайлуста введите свои данные для создания аккаунта</p>
              </div>
            </div>
            <div className={styles.right}>
              {/* Правая часть */}
              <form
                action=""
                className={styles.form}
                onSubmit={(e) => e.preventDefault()} // Предотвращаем отправку по умолчанию
              >
                <h2>Регистрация</h2>
                <input
                  type="email"
                  placeholder="Email"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value); // Обновляем имя пользователя
                  }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Обновляем пароль
                />
                <button
                  className={styles.btn}
                  type="submit"
                  onClick={handleSubmit} // Обработчик отправки
                >
                  Создать
                </button>
                <p className={styles.not_account}>
                  {/* Ссылка на вход */}
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
