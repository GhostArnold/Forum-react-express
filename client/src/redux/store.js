import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import postSlice from './features/post/postSlice';
import commentSlice from './features/comment/commentSlice';
import filterSlice from './features/filter/filterSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postSlice,
    comment: commentSlice,
    filter: filterSlice,
  },
});
