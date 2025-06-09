import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios.js';

const initialState = {
  posts: [],
  popularPosts: [],
  loading: false,
  error: null,
  searchQuery: '', // Add searchQuery to the state
};

export const getAllPosts = createAsyncThunk(
  'post/getAllPosts',
  async ({ query = '' } = {}, { rejectWithValue }) => {
    try {
      // Check if there is a search query
      const url = query ? `/posts?query=${query}` : `/posts`;
      const { data } = await axios.get(url);
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
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload; // Directly assign the posts
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.posts = []; // Clear posts on error
      });
  },
});

export const { setSearchQuery } = postSlice.actions;
export default postSlice.reducer;
