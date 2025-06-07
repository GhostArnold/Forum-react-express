import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios.js';

const initialState = {
  posts: [],
  popularPosts: [], // Исправлено опечатку (было popularPost)
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
      throw error; // Добавлено для корректной обработки ошибок
    }
  }
);

export const getAllPosts = createAsyncThunk('post/getAllPosts', async () => {
  try {
    const { data } = await axios.get('/posts'); // Добавлен слеш в начале
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export const removePost = createAsyncThunk(
  'post/removePost',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`/posts/${id}`);
      return { id, ...data };
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updatePost = createAsyncThunk(
  'post/updatePost',
  async (updatedPost, { rejectWithValue }) => {
    // Добавлен rejectWithValue
    try {
      const { data } = await axios.put(`/posts/${updatedPost.id}`, updatedPost);
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const likePost = createAsyncThunk(
  'post/likePost',
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`/posts/${postId}/like`);
      return data;
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
        state.posts.unshift(action.payload); // Добавляем в начало массива
      })
      .addCase(createPost.rejected, (state) => {
        state.loading = false;
      })

      // Get All Posts
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.popularPosts = action.payload.popularPosts || []; // Добавлен fallback
      })
      .addCase(getAllPosts.rejected, (state) => {
        state.loading = false;
      })

      // Remove Post
      .addCase(removePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter(
          (post) => post._id !== action.meta.arg
        );
        state.popularPosts = state.popularPosts.filter(
          (post) => post._id !== action.meta.arg
        );
      })
      .addCase(removePost.rejected, (state) => {
        state.loading = false;
      })

      // Update Post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index !== -1) state.posts[index] = action.payload;

        const popularIndex = state.popularPosts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (popularIndex !== -1)
          state.popularPosts[popularIndex] = action.payload;
      })
      .addCase(updatePost.rejected, (state) => {
        state.loading = false;
      })

      // Like Post
      .addCase(likePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.loading = false;

        // Обновляем в основном списке
        const postIndex = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (postIndex !== -1) {
          state.posts[postIndex] = action.payload;
        }

        // Обновляем в популярных
        const popularIndex = state.popularPosts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (popularIndex !== -1) {
          state.popularPosts[popularIndex] = action.payload;
        }
      })
      .addCase(likePost.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default postSlice.reducer;
