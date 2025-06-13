// src/redux/slices/filterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  title: '', // Начальное состояние для фильтра по заголовку
  author: '', // Начальное состояние для фильтра по автору
};

const filterSlice = createSlice({
  name: 'filter', // Имя слайса
  initialState, // Начальное состояние
  reducers: {
    // Редьюсеры (синхронные действия)
    setTitleFilter: (state, action) => {
      // Редьюсер для установки фильтра по заголовку
      state.title = action.payload; // Обновляем значение фильтра заголовка
    },
    setAuthorFilter: (state, action) => {
      // Редьюсер для установки фильтра по автору
      state.author = action.payload; // Обновляем значение фильтра автора
    },
    resetFilter: (state) => {
      // Редьюсер для сброса фильтров
      state.title = ''; // Сбрасываем фильтр заголовка
      state.author = ''; // Сбрасываем фильтр автора
    },
  },
});

export const { setTitleFilter, setAuthorFilter, resetFilter } =
  filterSlice.actions; // Экспортируем action creators

// Selector
export const selectTitleFilter = (state) => state.filter.title; // Селектор для получения фильтра по заголовку
export const selectAuthorFilter = (state) => state.filter.author; // Селектор для получения фильтра по автору

export default filterSlice.reducer; // Экспортируем редьюсер
