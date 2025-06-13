import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice'; // Импорт редьюсера аутентификации
import postSlice from './features/post/postSlice'; // Импорт редьюсера постов
import commentSlice from './features/comment/commentSlice'; // Импорт редьюсера комментариев
import filterSlice from './features/filter/filterSlice'; // Импорт редьюсера фильтров

export const store = configureStore({
  // Создаем Redux store
  reducer: {
    // Объект редьюсеров
    auth: authReducer, // Редьюсер аутентификации
    post: postSlice, // Редьюсер постов
    comment: commentSlice, // Редьюсер комментариев
    filter: filterSlice, // Редьюсер фильтров
  },
});
