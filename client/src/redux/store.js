import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import postSlice from './features/post/postSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postSlice,
  },
});
