import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddPostPage from '../pages/AddPostPage';
import EditPostPage from '../pages/EditPostPage';
import LoginPage from '../pages/LoginPage';
import MainPage from '../pages/MainPage';
import PostPage from '../pages/PostPage';
import PostsPage from '../pages/PostsPage';
// Для меню
import MainLayout from '../components/Layout/MainLayout';
import './App.scss';

function App() {
  return (
    //  BrowserRouter:  Оборачивает все приложение
    //  и предоставляет функциональность маршрутизации.
    //  Позволяет использовать Route и Routes компоненты
    //  для определения маршрутов.
    <BrowserRouter>
      <div className="App">
        {/* Внутри Routes хранятся все роуты */}
        <Routes>
          {/* Главный маршрут. С помощью которого на всех
           страницах будет отображаться меню */}
          <Route path="/" element={<MainLayout />}>
            {/* Дочерние маршруты. index - 
          тот же маршрут, который в главном маршруте */}
            <Route index element={<MainPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<LoginPage />} />
            <Route path="add-post" element={<AddPostPage />} />
            <Route path="my-posts" element={<PostsPage />} />
            <Route path=":id" element={<PostPage />} />
            <Route path="*" element={<AddPostPage />} />
            <Route />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
