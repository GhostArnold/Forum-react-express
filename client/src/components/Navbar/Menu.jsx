import { NavLink } from 'react-router-dom';
import style from './Menu.module.scss';
import profileImg from '../../assets/img/profile.png';
const Menu = () => {
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
        </div>
        <div>
          <NavLink to="/login">
            <button>Войти</button>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Menu;
