import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.scss';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { checkIsAuth, loginUser } from '../../redux/features/auth/authSlice';
const LoginPage = () => {
  // Состояния для инпутов
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { status } = useSelector((state) => state.auth);
  const isAuth = useSelector(checkIsAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (status) {
      toast(status);
    }
    if (isAuth) {
      navigate('/');
    }
  }, [status, isAuth, navigate]);

  const onSubmitHandler = () => {
    try {
      dispatch(loginUser({ username, password }));
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error(error);
    }
  };

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
            <form
              action=""
              className={styles.form}
              onSubmit={(e) => e.preventDefault()}
            >
              <h2>Авторизация</h2>
              <input
                type="email"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p></p>
              <button
                type="submit"
                className={styles.btn}
                onClick={onSubmitHandler}
              >
                Войти
              </button>
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
