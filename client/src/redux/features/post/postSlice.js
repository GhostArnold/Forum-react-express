// src/redux/features/post/postSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios.js';

const initialState = {
  posts: [], // Начальное состояние для хранения постов
  popularPosts: [], // Начальное состояние для хранения популярных постов
  loading: false, // Начальное состояние для индикатора загрузки
  badWordsError: null, // Начальное состояние для ошибки, связанной с нецензурными словами
  searchQuery: '', // Начальное состояние для поискового запроса
};

export const createPost = createAsyncThunk(
  // Асинхронный thunk для создания поста
  'post/createPost', // Уникальный идентификатор thunk
  async (params, { rejectWithValue }) => {
    // Функция, которая будет выполнена при вызове thunk
    try {
      const { data } = await axios.post('/posts', params); // Отправляем POST-запрос
      return data; // Возвращаем полученные данные
    } catch (error) {
      // Обрабатываем ошибки
      if (error.response?.data?.errorType === 'BAD_WORDS') {
        // Если ошибка связана с нецензурными словами
        return rejectWithValue({
          // Возвращаем объект ошибки
          message:
            'Пост содержит недопустимые слова. Измените текст и попробуйте снова.',
          type: 'badWords',
        });
      }
      return rejectWithValue(error.response.data); // Возвращаем общую ошибку
    }
  }
);

export const getAllPosts = createAsyncThunk(
  // Асинхронный thunk для получения всех постов
  'post/getAllPosts', // Уникальный идентификатор thunk
  async ({ query = '' } = {}, { rejectWithValue }) => {
    // Функция, которая будет выполнена при вызове thunk
    try {
      const url = query ? `/posts?query=${query}` : '/posts'; // Формируем URL в зависимости от наличия запроса
      const { data } = await axios.get(url); // Отправляем GET-запрос
      return data; // Возвращаем полученные данные
    } catch (error) {
      console.error(error); // Выводим ошибку в консоль
      return rejectWithValue(error.response.data); // Возвращаем ошибку
    }
  }
);

export const removePost = createAsyncThunk(
  // Асинхронный thunk для удаления поста
  'post/removePost', // Уникальный идентификатор thunk
  async (id, { rejectWithValue }) => {
    // Функция, которая будет выполнена при вызове thunk
    try {
      const { data } = await axios.delete(`/posts/${id}`); // Отправляем DELETE-запрос
      return { id, ...data }; // Возвращаем ID удаленного поста
    } catch (error) {
      console.error(error); // Выводим ошибку в консоль
      return rejectWithValue(error.response.data); // Возвращаем ошибку
    }
  }
);

export const updatePost = createAsyncThunk(
  // Асинхронный thunk для обновления поста
  'post/updatePost', // Уникальный идентификатор thunk
  async (updatedPost, { rejectWithValue }) => {
    // Функция, которая будет выполнена при вызове thunk
    try {
      const { data } = await axios.put(`/posts/${updatedPost.id}`, updatedPost); // Отправляем PUT-запрос
      return data; // Возвращаем обновленные данные
    } catch (error) {
      console.error(error); // Выводим ошибку в консоль
      return rejectWithValue(error.response.data); // Возвращаем ошибку
    }
  }
);

export const likePost = createAsyncThunk(
  // Асинхронный thunk для лайка поста
  'post/likePost', // Уникальный идентификатор thunk
  async (postId, { rejectWithValue }) => {
    // Функция, которая будет выполнена при вызове thunk
    try {
      const { data } = await axios.patch(`/posts/${postId}/like`); // Отправляем PATCH-запрос
      return data; // Возвращаем обновленные данные
    } catch (error) {
      console.error(error); // Выводим ошибку в консоль
      return rejectWithValue(error.response.data); // Возвращаем ошибку
    }
  }
);

export const postSlice = createSlice({
  name: 'post', // Имя слайса
  initialState, // Начальное состояние
  reducers: {
    // Редьюсеры (синхронные действия)
    setSearchQuery: (state, action) => {
      // Редьюсер для установки поискового запроса
      state.searchQuery = action.payload; // Обновляем поисковый запрос
    },
  },
  extraReducers: (builder) => {
    // Обработчики для асинхронных действий
    builder
      // Создание поста
      .addCase(createPost.pending, (state) => {
        // Обработка состояния "pending" для createPost
        state.loading = true; // Устанавливаем loading в true
      })
      .addCase(createPost.fulfilled, (state) => {
        // Обработка состояния "fulfilled" для createPost
        state.loading = false; // Устанавливаем loading в false
      })
      .addCase(createPost.rejected, (state, action) => {
        // Обработка состояния "rejected" для createPost
        state.loading = false; // Устанавливаем loading в false
        state.badWordsError = action.payload; // Устанавливаем ошибку, связанную с нецензурными словами
      })

      // Получение постов
      .addCase(getAllPosts.pending, (state) => {
        // Обработка состояния "pending" для getAllPosts
        state.loading = true; // Устанавливаем loading в true
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        // Обработка состояния "fulfilled" для getAllPosts
        state.loading = false; // Устанавливаем loading в false
        state.posts = action.payload; // Устанавливаем полученные посты
      })
      .addCase(getAllPosts.rejected, (state) => {
        // Обработка состояния "rejected" для getAllPosts
        state.loading = false; // Устанавливаем loading в false
        state.posts = []; // Очищаем список постов в случае ошибки
      })

      // Удаление поста
      .addCase(removePost.pending, (state) => {
        // Обработка состояния "pending" для removePost
        state.loading = true; // Устанавливаем loading в true
      })
      .addCase(removePost.fulfilled, (state, action) => {
        // Обработка состояния "fulfilled" для removePost
        state.loading = false; // Устанавливаем loading в false
        state.posts = state.posts.filter(
          (post) => post._id !== action.payload.id
        ); // Удаляем пост из списка
      })
      .addCase(removePost.rejected, (state) => {
        // Обработка состояния "rejected" для removePost
        state.loading = false; // Устанавливаем loading в false
      })

      // Обновление поста
      .addCase(updatePost.pending, (state) => {
        // Обработка состояния "pending" для updatePost
        state.loading = true; // Устанавливаем loading в true
      })
      .addCase(updatePost.fulfilled, (state) => {
        // Обработка состояния "fulfilled" для updatePost
        state.loading = false; // Устанавливаем loading в false
      })
      .addCase(updatePost.rejected, (state) => {
        // Обработка состояния "rejected" для updatePost
        state.loading = false; // Устанавливаем loading в false
      })

      // Лайк поста
      .addCase(likePost.pending, (state) => {
        // Обработка состояния "pending" для likePost
        state.loading = true; // Устанавливаем loading в true
      })
      .addCase(likePost.fulfilled, (state) => {
        // Обработка состояния "fulfilled" для likePost
        state.loading = false; // Устанавливаем loading в false
      })
      .addCase(likePost.rejected, (state) => {
        // Обработка состояния "rejected" для likePost
        state.loading = false; // Устанавливаем loading в false
      });
  },
});

export const { setSearchQuery } = postSlice.actions; // Экспортируем action creator
export default postSlice.reducer; // Экспортируем редьюсер
