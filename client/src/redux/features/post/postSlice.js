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
      });
  },
});

export default postSlice.reducer;
