import axios from 'axios';

// Создаёт новый экземпляр Axios с кастомными настройками
const instanse = axios.create({
  // Базовый url адрес, который будет добавляться к каждому запросу
  baseURL: 'http://localhost:3002/api',
});
// interceptors — это механизм Axios для перехвата запросов/ответов перед их отправкой/получением.
// Бывает два типа:
// .request — перехватывает исходящие запросы
// .response — перехватывает входящие ответы

instanse.interceptors.request.use((config) => {
  // Добавляет в заголовки запроса поле Authorization.
  // Достаёт из localStorage значение по ключу 'token'.
  config.headers.Authorization = window.localStorage.getItem('token');

  // Обязательно вернуть изменённый config, иначе запрос не отправится.
  return config;
});

export default instanse;
