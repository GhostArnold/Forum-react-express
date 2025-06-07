import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios.js';

const initialState = {
  comments: [],
  loading: false,
};

export const getPostComments = createAsyncThunk(
  'comment/getPostComments',
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/comments/comments/${postId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createComment = createAsyncThunk(
  'comment/createComment',
  async ({ postId, comment }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/comments/${postId}`, {
        postId,
        comment,
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Post
      .addCase(createComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(createComment.rejected, (state) => {
        state.loading = false;
      })

      // Получение постов
      .addCase(getPostComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPostComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(getPostComments.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default commentSlice.reducer;
