import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios.js';

const initialState = {
  comments: [], // Начальное состояние для комментариев
  loading: false, // Начальное состояние для индикатора загрузки
};

export const getPostComments = createAsyncThunk(
  // Асинхронный thunk для получения комментариев к посту
  'comment/getPostComments', // Уникальный идентификатор thunk
  async (postId, { rejectWithValue }) => {
    // Функция, которая будет выполнена при вызове thunk
    try {
      const { data } = await axios.get(`/comments/comments/${postId}`); // Отправляем GET-запрос
      return data; // Возвращаем полученные данные
    } catch (error) {
      return rejectWithValue(error.response.data); // Обрабатываем ошибку
    }
  }
);

export const createComment = createAsyncThunk(
  // Асинхронный thunk для создания комментария
  'comment/createComment', // Уникальный идентификатор thunk
  async ({ postId, comment }, { rejectWithValue }) => {
    // Функция, которая будет выполнена при вызове thunk
    try {
      const { data } = await axios.post(`/comments/${postId}`, {
        // Отправляем POST-запрос
        postId,
        comment,
      });
      return data; // Возвращаем полученные данные
    } catch (error) {
      return rejectWithValue(error.response.data); // Обрабатываем ошибку
    }
  }
);

export const commentSlice = createSlice({
  name: 'comment', // Имя слайса
  initialState, // Начальное состояние
  reducers: {}, // Редьюсеры (синхронные действия)
  extraReducers: (builder) => {
    // Обработчики для асинхронных действий
    builder
      // Create Post
      .addCase(createComment.pending, (state) => {
        // Обработка состояния "pending" для createComment
        state.loading = true; // Устанавливаем loading в true
      })
      .addCase(createComment.fulfilled, (state, action) => {
        // Обработка состояния "fulfilled" для createComment
        state.loading = false; // Устанавливаем loading в false
        state.comments.push(action.payload); // Добавляем новый комментарий в состояние
      })
      .addCase(createComment.rejected, (state) => {
        // Обработка состояния "rejected" для createComment
        state.loading = false; // Устанавливаем loading в false
      })

      // Получение постов
      .addCase(getPostComments.pending, (state) => {
        // Обработка состояния "pending" для getPostComments
        state.loading = true; // Устанавливаем loading в true
      })
      .addCase(getPostComments.fulfilled, (state, action) => {
        // Обработка состояния "fulfilled" для getPostComments
        state.loading = false; // Устанавливаем loading в false
        state.comments = action.payload; // Устанавливаем полученные комментарии в состояние
      })
      .addCase(getPostComments.rejected, (state) => {
        // Обработка состояния "rejected" для getPostComments
        state.loading = false; // Устанавливаем loading в false
      });
  },
});

export default commentSlice.reducer;
