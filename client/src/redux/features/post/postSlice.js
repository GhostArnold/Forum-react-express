// src/redux/features/post/postSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios.js';

const initialState = {
  posts: [], // Массив для хранения постов
  popularPosts: [], // Массив для хранения популярных постов
  loading: false, // Индикатор загрузки
  badWordsError: null, // Ошибка, если в тексте поста есть плохие слова
  searchQuery: '', // Строка поискового запроса
};

// Async Thunk для создания поста
export const createPost = createAsyncThunk(
  'post/createPost',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/posts', params); // Отправляем запрос на создание поста
      return data; // Возвращаем данные
    } catch (error) {
      if (error.response?.data?.errorType === 'BAD_WORDS') {
        return rejectWithValue({
          message:
            'Пост содержит недопустимые слова. Измените текст и попробуйте снова.',
          type: 'badWords',
        });
      }
      return rejectWithValue(error.response.data); // Возвращаем ошибку
    }
  }
);

// Async Thunk для получения всех постов
export const getAllPosts = createAsyncThunk(
  'post/getAllPosts',
  async ({ query = '' } = {}, { rejectWithValue }) => {
    try {
      const url = query ? `/posts?query=${query}` : '/posts'; // Формируем URL в зависимости от наличия query
      const { data } = await axios.get(url); // Отправляем запрос на получение постов
      return data; // Возвращаем данные
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data); // Возвращаем ошибку
    }
  }
);

// Async Thunk для удаления поста
export const removePost = createAsyncThunk(
  'post/removePost',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/posts/${id}`); // Отправляем запрос на удаление поста
      return { id, ...data }; // Возвращаем ID удаленного поста
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data); // Возвращаем ошибку
    }
  }
);

// Async Thunk для обновления поста
export const updatePost = createAsyncThunk(
  'post/updatePost',
  async (updatedPost, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/posts/${updatedPost.id}`, updatedPost); // Отправляем запрос на обновление поста
      return data; // Возвращаем данные
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data); // Возвращаем ошибку
    }
  }
);

// Async Thunk для лайка поста
export const likePost = createAsyncThunk(
  'post/likePost',
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`/posts/${postId}/like`); // Отправляем запрос на лайк поста
      return data; // Возвращаем данные
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data); // Возвращаем ошибку
    }
  }
);

// Создаем Slice
export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload; // Reducer to update search query
    },
  },
  extraReducers: (builder) => {
    builder
      // ----------- CREATE POST -----------
      .addCase(createPost.pending, (state) => {
        state.loading = true; // Загрузка началась
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false; // Загрузка закончилась
        state.posts.unshift(action.payload); // Добавляем новый пост в начало массива
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false; // Загрузка закончилась
        if (action.payload?.type === 'badWords') {
          state.badWordsError = action.payload.message; // Сохраняем сообщение об ошибке
        } else {
          state.error = action.error.message; // Сохраняем сообщение об ошибке
        }
      })
      // ----------- GET ALL POSTS -----------
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true; // Загрузка началась
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false; // Загрузка закончилась
        if (Array.isArray(action.payload)) {
          state.posts = action.payload; // Если бэкенд возвращает просто массив постов
          state.popularPosts = []; // Очищаем popularPosts
        } else {
          state.posts = action.payload.posts; // Сохраняем посты
          state.popularPosts = action.payload.popularPosts || []; // Сохраняем популярные посты
        }
      })
      .addCase(getAllPosts.rejected, (state) => {
        state.loading = false; // Загрузка закончилась
      })
      // ----------- REMOVE POST -----------
      .addCase(removePost.pending, (state) => {
        state.loading = true; // Загрузка началась
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.loading = false; // Загрузка закончилась
        state.posts = state.posts.filter(
          (post) => post._id !== action.meta.arg // Фильтруем посты, удаляя удаленный
        );
        state.popularPosts = state.popularPosts.filter(
          (post) => post._id !== action.meta.arg // Фильтруем популярные посты, удаляя удаленный
        );
      })
      .addCase(removePost.rejected, (state) => {
        state.loading = false; // Загрузка закончилась
      })
      // ----------- UPDATE POST -----------
      .addCase(updatePost.pending, (state) => {
        state.loading = true; // Загрузка началась
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false; // Загрузка закончилась
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id // Находим индекс обновленного поста
        );
        if (index !== -1) state.posts[index] = action.payload; // Обновляем пост в массиве

        const popularIndex = state.popularPosts.findIndex(
          (post) => post._id === action.payload._id // Находим индекс обновленного популярного поста
        );
        if (popularIndex !== -1)
          state.popularPosts[popularIndex] = action.payload; // Обновляем популярный пост в массиве
      })
      .addCase(updatePost.rejected, (state) => {
        state.loading = false; // Загрузка закончилась
      })
      // ----------- LIKE POST -----------
      .addCase(likePost.pending, (state) => {
        state.loading = true; // Загрузка началась
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.loading = false; // Загрузка закончилась
        // Обновляем в основном списке
        const postIndex = state.posts.findIndex(
          (post) => post._id === action.payload._id // Находим индекс поста
        );
        if (postIndex !== -1) {
          state.posts[postIndex] = action.payload; // Обновляем пост
        }

        // Обновляем в популярных
        const popularIndex = state.popularPosts.findIndex(
          (post) => post._id === action.payload._id // Находим индекс популярного поста
        );
        if (popularIndex !== -1) {
          state.popularPosts[popularIndex] = action.payload; // Обновляем популярный пост
        }
      })
      .addCase(likePost.rejected, (state) => {
        state.loading = false; // Загрузка закончилась
      });
  },
});

export const { setSearchQuery } = postSlice.actions; // Export setSearchQuery
export default postSlice.reducer; // Export reducer
