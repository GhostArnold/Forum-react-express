import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../utils/axios';

const initialState = {
  user: null, // Данные пользователя
  token: null, // JWT-токен
  isLoading: false, // Флаг загрузки
  status: null, // Сообщения с сервера (ошибки/успех)
};

// Redux Toolkit автоматически создаёт три экшена на основе createAsyncThunk:
// 1.Pending 2.Fulfilled 3.rejected
export const registerUser = createAsyncThunk(
  // Уникальный идентификатор экшена
  'auth/registerUser',
  // rejectWithValue — это специальная функция из Redux Toolkit, которая:
  // Позволяет кастомизировать payload (данные) при ошибке.
  // Передаёт структурированные данные об ошибке (не только текст).
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // 1. Отправка запроса на сервер
      // data: Ответ сервера (например, { token: '...', user: { ... } }).
      const { data } = await axios.post('auth/register', {
        username,
        password,
      });
      // 2. Сохранение токена
      if (data.token) {
        window.localStorage.setItem('token', data.token);
      }
      // 3. Возврат данных
      return data;
    } catch (error) {
      // { message: 'User exists', code: 409 }
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // 1. Отправка запроса на сервер
      // data: Ответ сервера (например, { token: '...', user: { ... } }).
      const { data } = await axios.post('auth/login', {
        username,
        password,
      });
      // 2. Сохранение токена
      if (data.token) {
        window.localStorage.setItem('token', data.token);
      }
      // 3. Возврат данных
      return data;
    } catch (error) {
      // { message: 'User exists', code: 409 }
      return rejectWithValue(error.response.data);
    }
  }
);

export const getMe = createAsyncThunk('auth/me', async () => {
  try {
    // 1. Отправка запроса на сервер
    // data: Ответ сервера (например, { token: '...', user: { ... } }).
    const { data } = await axios.post('auth/me');
    // 2. Сохранение токена
    if (data.token) {
      window.localStorage.setItem('token', data.token);
    }
    // 3. Возврат данных
    return data;
  } catch (error) {
    console.error(error);
  }
});

export const authSlice = createSlice({
  // 1. Имя слайса (префикс для экшенов)
  name: 'auth',
  // 2. Начальное состояние
  initialState,
  // Синхронные редьюсеры
  reducers: {
    // Для обнуления статуса для окна ошибки
    clearStatus(state) {
      state.status = null;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoading = false;
      state.status = null;
    },
  },
  // Ассинхронные редьюсеры
  extraReducers: (builder) => {
    // Это специальный объект, который помогает добавлять обработчики для асинхронных экшенов.
    builder
      // РЕГИСТРАЦИЯ

      // pending - Запрос начался
      .addCase(registerUser.pending, (state) => {
        // Показываем спиннер/загрузку
        state.isLoading = true;
        // Сбрасываем предыдущие сообщения
        state.status = null;
      })
      // Запрос успешен
      .addCase(registerUser.fulfilled, (state, action) => {
        // Убираем загрузку
        state.isLoading = false;
        // Добавляем в payload данные с ответа
        // action.payload — это то, что мы вернули в registerUser при успехе (return data).
        state.status = action.payload?.message;
        state.user = action.payload?.newUser;
        state.token = action.payload?.token;
      })
      // Запрос провален
      .addCase(registerUser.rejected, (state, action) => {
        // Убираем загрузку
        state.isLoading = false;
        // Ошибка с сервера (например, "User already exists")
        state.status = action.payload?.message;
      })

      // АВТОРИЗАЦИЯ

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.status = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = action.payload?.message;
        state.user = action.payload?.user;
        state.token = action.payload?.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.status = action.payload?.message;
      })

      // Get Me

      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
        state.status = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        // ? - значит - если есть. Типо если токен есть, то мы его в пэйлод засовываем
        state.status = action.payload?.message;
        state.user = action.payload?.user;
        state.token = action.payload?.token;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.status = action.payload?.message;
      });
  },
});

export const checkIsAuth = (state) => Boolean(state.auth.token);

export default authSlice.reducer;
// Экспортируем action creator для сброса статуса
export const { clearStatus } = authSlice.actions;
export const { logout } = authSlice.actions;
