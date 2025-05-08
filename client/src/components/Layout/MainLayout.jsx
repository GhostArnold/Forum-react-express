import { Outlet } from 'react-router-dom';
import Menu from '../Navbar/Menu';
const MainLayout = () => {
  return (
    <div>
      <Menu />
      {/* Компонент, чтобы помимо Menu отображалось ещё содержимое дочерних
      маршрутов */}
      <Outlet />
    </div>
  );
};

export default MainLayout;
