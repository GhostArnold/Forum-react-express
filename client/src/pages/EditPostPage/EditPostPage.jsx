import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import line from '../../assets/img/line.png';
import redPinning from '../../assets/img/red-pinning.png';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axios.js';
import { updatePost } from '../../redux/features/post/postSlice';
import styles from './EditPostPage.module.scss';

const EditPostPage = () => {
  const [title, setTitle] = useState(''); // Состояние для заголовка поста
  const [text, setText] = useState(''); // Состояние для текста поста
  const [newImage, setNewImage] = useState(''); // Состояние для нового изображения
  // const [oldImage, setOldImage] = useState('');

  const dispatch = useDispatch(); // Получаем функцию dispatch из Redux
  const navigate = useNavigate(); // Получаем функцию navigate для переходов
  const params = useParams(); // Получаем параметры URL

  const fetchPost = useCallback(async () => {
    // Функция для получения данных поста
    const { data } = await axios.get(`/posts/${params.id}`); // Получаем данные поста по ID
    setTitle(data.text); // Устанавливаем заголовок
    setText(data.text); // Устанавливаем текст
    // setOldImage(data.imgUrl);
  }, [params.id]);

  const submitHandler = () => {
    // Функция для отправки данных на обновление
    try {
      const updatedPost = new FormData(); // Создаем объект FormData
      updatedPost.append('title', title); // Добавляем заголовок
      updatedPost.append('text', text); // Добавляем текст
      updatedPost.append('id', params.id); // Добавляем ID поста
      updatedPost.append('image', newImage); // Добавляем новое изображение
      dispatch(updatePost(updatedPost)); // Отправляем действие на обновление
      navigate('/my-posts'); // Перенаправляем на страницу "Мои посты"
    } catch (error) {
      console.log(error); // Выводим ошибку в консоль
    }
  };

  const clearFormHandler = () => {
    // Функция для очистки формы
    setTitle(''); // Очищаем заголовок
    setText(''); // Очищаем текст
  };

  useEffect(() => {
    // Получаем данные поста при монтировании компонента
    fetchPost();
  }, [fetchPost]);

  return (
    <div>
      <div className={styles.main}>
        <div className={styles.wallpaper}>
          {/* Форма редактирования поста */}
          <form
            action=""
            className={styles.form}
            onSubmit={(e) => e.preventDefault()} // Предотвращаем отправку формы по умолчанию
          >
            {/* Загрузка нового изображения */}
            <input
              type="file"
              onChange={(e) => {
                setNewImage(e.target.files[0]); // Устанавливаем новое изображение
                // setOldImage('');
              }}
            />
            {/* ЧТобы картинка вставлялась при создании поста */}
            {/* <div className={styles.postImg}>
              {image && <img src={URL.createObjectURL(image)} alt="image" />}
            </div> */}
            {/* Заголовок поста */}
            <label htmlFor="title">Заголовок поста: </label>
            <input
              id="title"
              type="text"
              placeholder="Заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)} // Обновляем состояние заголовка
            />
            {/* Текст поста */}
            <label htmlFor="textPost">Текст поста: </label>
            <textarea
              id="textPost"
              type="text"
              placeholder="Текст поста"
              value={text}
              onChange={(e) => setText(e.target.value)} // Обновляем состояние текста
            />
            {/* Кнопка редактирования */}
            <button onClick={submitHandler}>Редактировать</button>
            {/* Кнопка отмены */}
            <button onClick={clearFormHandler}>Отменить</button>

            {/* Декоративные элементы */}
            <img
              src={line}
              alt=""
              className={`${styles.line} ${styles.first}`}
            />
            <img
              src={line}
              alt=""
              className={`${styles.line} ${styles.second}`}
            />
            <img
              src={redPinning}
              alt=""
              className={`${styles.redPinning} ${styles.first}`}
            />
            <img
              src={redPinning}
              alt=""
              className={`${styles.redPinning} ${styles.second}`}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;
