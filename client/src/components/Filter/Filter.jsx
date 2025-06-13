import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios.js';

// Определяем начальное состояние слайса (части) хранилища Redux
const initialState = {
  posts: [], // Массив для хранения постов
  popularPosts: [], // Массив для хранения популярных постов (сейчас не используется)
  loading: false, // Флаг, указывающий на состояние загрузки данных
  error: null, // Объект ошибки, если при загрузке что-то пошло не так
  searchQuery: '', // Строка поискового запроса. Используется для фильтрации постов
};

// Асинхронный thunk для получения всех постов (с возможностью фильтрации по запросу)
export const getAllPosts = createAsyncThunk(
  'post/getAllPosts', // Уникальное имя для этого thunk (используется в Redux DevTools)
  async ({ query = '' } = {}, { rejectWithValue }) => {
    // Функция, выполняемая при вызове thunk
    try {
      // Проверяем, есть ли поисковый запрос (query)
      const url = query ? `/posts?query=${query}` : `/posts`; // Формируем URL в зависимости от наличия запроса
      const { data } = await axios.get(url); // Отправляем GET-запрос к API с помощью axios
      return data; // Возвращаем полученные данные (массив постов)
    } catch (error) {
      // Обрабатываем ошибки
      console.error(error); // Выводим ошибку в консоль (для отладки)
      return rejectWithValue(error.response.data); // Возвращаем ошибку, чтобы Redux Toolkit мог её обработать
    }
  }
);

// Создаем слайс Redux
export const postSlice = createSlice({
  name: 'post', // Уникальное имя слайса (используется в Redux DevTools)
  initialState, // Начальное состояние слайса
  reducers: {
    // Объект редьюсеров (функций, изменяющих состояние)
    setSearchQuery: (state, action) => {
      // Редьюсер для установки поискового запроса
      state.searchQuery = action.payload; // Обновляем поисковый запрос в состоянии
    },
  },
  extraReducers: (builder) => {
    // Объект extraReducers. Используется для обработки состояний асинхронных thunk
    builder
      .addCase(getAllPosts.pending, (state) => {
        // Обрабатываем состояние "pending" (загрузка началась)
        state.loading = true; // Устанавливаем флаг загрузки в true
        state.error = null; // Сбрасываем предыдущую ошибку
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        // Обрабатываем состояние "fulfilled" (загрузка успешно завершена)
        state.loading = false; // Устанавливаем флаг загрузки в false
        state.posts = action.payload; // Записываем полученные посты в состояние
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        // Обрабатываем состояние "rejected" (загрузка завершилась с ошибкой)
        state.loading = false; // Устанавливаем флаг загрузки в false
        state.error = action.payload; // Записываем объект ошибки в состояние
        state.posts = []; // Очищаем массив постов (чтобы не отображать старые данные)
      });
  },
});

// Экспортируем редьюсер для обновления поискового запроса
export const { setSearchQuery } = postSlice.actions;
// Экспортируем редьюсер слайса
export default postSlice.reducer;
