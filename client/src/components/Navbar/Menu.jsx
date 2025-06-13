import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import style from './Menu.module.scss';
import profileImg from '../../assets/img/profile.png';
import { checkIsAuth, logout } from '../../redux/features/auth/authSlice.js';
import { useState } from 'react';

const Menu = () => {
  const isAuth = useSelector(checkIsAuth); // Получаем состояние аутентификации из Redux
  const dispatch = useDispatch(); // Получаем функцию dispatch для отправки действий в Redux
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Состояние для открытия/закрытия меню (мобильная версия)

  const logoutHandler = () => {
    dispatch(logout()); // Отправляем действие logout в Redux
    localStorage.removeItem('token'); // Удаляем токен из localStorage
    toast('Вы вышли из системы'); // Отображаем уведомление об выходе
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Переключаем состояние меню
  };

  return (
    <div>
      {/* Главный контейнер навигации */}
      <nav className={`${style.navbar} ${isMenuOpen ? style.open : ''}`}>
        {/* Профиль пользователя */}
        <div className={style.profile}>
          <img src={profileImg} alt="Мой профиль" width="25px" height="25px" />
        </div>
        {/* Кнопка "гамбургер" (мобильная версия) */}
        <button className={style.hamburger} onClick={toggleMenu}>
          ☰
        </button>

        {/* Основные ссылки навигации */}
        <div className={`${style.mainNav} ${style.mobileNav}`}>
          {/* Ссылка "Главная" */}
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? style.active : '')}
            onClick={() => setIsMenuOpen(false)} // Закрываем меню при клике
          >
            Главная
          </NavLink>
          {/* Ссылки для авторизованных пользователей */}
          {isAuth && (
            <>
              {/* Ссылка "Мои посты" */}
              <NavLink
                to="/my-posts"
                className={({ isActive }) => (isActive ? style.active : '')}
                onClick={() => setIsMenuOpen(false)} // Закрываем меню при клике
              >
                Мои посты
              </NavLink>
              {/* Ссылка "Добавить пост" */}
              <NavLink
                to="/add-post"
                className={({ isActive }) => (isActive ? style.active : '')}
                onClick={() => setIsMenuOpen(false)} // Закрываем меню при клике
              >
                Добавить пост
              </NavLink>
            </>
          )}
        </div>

        {/* Кнопки "Войти" / "Выйти" */}
        <div className={`${style.btn} ${style.mobileBtn}`}>
          {/* Кнопка "Выйти" (для авторизованных) / "Войти" (для неавторизованных) */}
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
