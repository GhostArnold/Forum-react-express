import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios.js';

const initialState = {
  posts: [],
  popularPost: [],
  loading: false,
};

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (params) => {
    try {
      const { data } = await axios.post('/posts', params);
      return data;
    } catch (error) {
      console.error(error);
    }
  }
);

export const getAllPosts = createAsyncThunk('post/getAllPosts', async () => {
  try {
    const { data } = await axios.get('posts');
    return data;
  } catch (error) {
    console.error(error);
  }
});

export const removePost = createAsyncThunk(
  'post/removePost',
  async (id, { rejectWithValue }) => {
    // Добавлен rejectWithValue
    try {
      const { data } = await axios.delete(`/posts/${id}`); // Исправлено: URL /posts вместо /post
      return { id, ...data }; // Возвращаем id для использования в редюсере
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.push(action.payload);
      })
      .addCase(createPost.rejected, (state) => {
        state.loading = false;
      })

      // Получение всех постов
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.popularPosts = action.payload.popularPosts;
      })
      .addCase(getAllPosts.rejected, (state) => {
        state.loading = false;
      })

      // Удаление поста
      .addCase(removePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.loading = false;
        // Исправлено: используем action.meta.arg вместо action.payload._id
        state.posts = state.posts.filter(
          (post) => post._id !== action.meta.arg
        );
      })
      .addCase(removePost.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default postSlice.reducer;
