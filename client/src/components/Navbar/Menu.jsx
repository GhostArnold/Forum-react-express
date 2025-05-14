import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import style from './Menu.module.scss';
import profileImg from '../../assets/img/profile.png';
import { checkIsAuth, logout } from '../../redux/features/auth/authSlice.js';

const Menu = () => {
  const isAuth = useSelector(checkIsAuth);
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
    window.localStorage.removeItem('token');
    toast('Вы вышли из системы');
  };

  return (
    <div>
      {/* Делаем навбар */}
      <nav className={style.navbar}>
        <div>
          <img src={profileImg} alt="Мой профиль" width="25px" height="25px" />
        </div>
        <div className={style.mainNav}>
          <NavLink
            to="/"
            // Если активно, то применяем стили из scss
            className={({ isActive }) => (isActive ? style.active : '')}
          >
            Главная
          </NavLink>
          {isAuth && (
            <>
              <NavLink
                to="/my-posts"
                className={({ isActive }) => (isActive ? style.active : '')}
              >
                Мои посты
              </NavLink>
              <NavLink
                to="/add-post"
                className={({ isActive }) => (isActive ? style.active : '')}
              >
                Добавить пост
              </NavLink>
            </>
          )}
        </div>
        <div className={style.btn}>
          {isAuth ? (
            <button onClick={logoutHandler}>Выйти</button>
          ) : (
            <NavLink to="/login">
              <button>Войти</button>
            </NavLink>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Menu;
