import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import style from './Menu.module.scss';
import profileImg from '../../assets/img/profile.png';
import { checkIsAuth, logout } from '../../redux/features/auth/authSlice.js';
import { useState } from 'react'; // Import useState

const Menu = () => {
  const isAuth = useSelector(checkIsAuth);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for menu open/close

  const logoutHandler = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    toast('Вы вышли из системы');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle menu state
  };

  return (
    <div>
      <nav className={`${style.navbar} ${isMenuOpen ? style.open : ''}`}>
        <div className={style.profile}>
          <img src={profileImg} alt="Мой профиль" width="25px" height="25px" />
        </div>
        {/* Hamburger button for mobile */}
        <button className={style.hamburger} onClick={toggleMenu}>
          ☰
        </button>

        <div className={`${style.mainNav} ${style.mobileNav}`}>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? style.active : '')}
            onClick={() => setIsMenuOpen(false)} // Close menu on click
          >
            Главная
          </NavLink>
          {isAuth && (
            <>
              <NavLink
                to="/my-posts"
                className={({ isActive }) => (isActive ? style.active : '')}
                onClick={() => setIsMenuOpen(false)} // Close menu on click
              >
                Мои посты
              </NavLink>
              <NavLink
                to="/add-post"
                className={({ isActive }) => (isActive ? style.active : '')}
                onClick={() => setIsMenuOpen(false)} // Close menu on click
              >
                Добавить пост
              </NavLink>
            </>
          )}
        </div>

        <div className={`${style.btn} ${style.mobileBtn}`}>
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
