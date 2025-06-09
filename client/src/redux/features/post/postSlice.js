// src/redux/features/post/postSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios.js';

const initialState = {
  posts: [],
  popularPosts: [],
  loading: false,
  badWordsError: null,
  searchQuery: '', // Added searchQuery to initial state
};

export const createPost = createAsyncThunk(
  'post/createPost',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/posts', params);
      return data;
    } catch (error) {
      if (error.response?.data?.errorType === 'BAD_WORDS') {
        return rejectWithValue({
          message:
            'Пост содержит недопустимые слова. Измените текст и попробуйте снова.',
          type: 'badWords',
        });
      }
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllPosts = createAsyncThunk(
  'post/getAllPosts',
  async ({ query = '' } = {}, { rejectWithValue }) => {
    try {
      const url = query ? `/posts?query=${query}` : '/posts';
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data);
    }
  }
);

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
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload; // Reducer to update search query
    },
  },
  extraReducers: (builder) => {
    builder
      // ----------- CREATE POST -----------
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.type === 'badWords') {
          state.badWordsError = action.payload.message;
        } else {
          state.error = action.error.message;
        }
      })
      // ----------- GET ALL POSTS -----------
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.posts = action.payload; // If backend returns just posts
          state.popularPosts = []; // Clear popularPosts
        } else {
          state.posts = action.payload.posts;
          state.popularPosts = action.payload.popularPosts || [];
        }
      })
      .addCase(getAllPosts.rejected, (state) => {
        state.loading = false;
      })
      // ----------- REMOVE POST -----------
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
      // ----------- UPDATE POST -----------
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
      // ----------- LIKE POST -----------
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

export const { setSearchQuery } = postSlice.actions; // Export setSearchQuery
export default postSlice.reducer;
