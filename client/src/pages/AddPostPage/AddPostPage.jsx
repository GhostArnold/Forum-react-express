import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import line from '../../assets/img/line.png';
import redPinning from '../../assets/img/red-pinning.png';
import { createPost } from '../../redux/features/post/postSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './AddPostPage.module.scss';
import { containsBadWords } from '../../utils/badWords.js'; // Импорт функции для проверки на нецензурные слова

const AddPostPage = () => {
  const [title, setTitle] = useState(''); // Состояние для заголовка поста
  const [text, setText] = useState(''); // Состояние для текста поста
  const [image, setImage] = useState(null); // Состояние для изображения
  const dispatch = useDispatch(); // Получаем функцию dispatch из Redux
  const navigate = useNavigate(); // Получаем функцию navigate для переходов по страницам
  const { loading } = useSelector((state) => state.post); // Получаем состояние загрузки из Redux

  const submitHandler = async () => {
    try {
      // Проверяем заголовок и текст на наличие нецензурных слов
      if (containsBadWords(title) || containsBadWords(text)) {
        toast.error('Была использована неформальная лексика', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
        return; // Прерываем отправку, если есть нецензурные слова
      }

      const formData = new FormData(); // Создаем объект FormData для отправки данных
      formData.append('title', title); // Добавляем заголовок в FormData
      formData.append('text', text); // Добавляем текст в FormData
      if (image) formData.append('image', image); // Добавляем изображение в FormData, если оно есть

      const resultAction = await dispatch(createPost(formData)); // Отправляем асинхронное действие для создания поста

      // Обрабатываем результат создания поста
      if (createPost.fulfilled.match(resultAction)) {
        toast.success('Пост успешно создан!'); // Выводим сообщение об успехе
        navigate('/'); // Перенаправляем на главную страницу
      } else if (createPost.rejected.match(resultAction)) {
        // Обрабатываем ошибку при создании поста
        if (resultAction.payload?.type === 'badWords') {
          toast.error(resultAction.payload.message, {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'colored',
          }); // Выводим сообщение об ошибке, если есть нецензурные слова на сервере
        } else {
          toast.error('Ошибка при создании поста'); // Выводим общее сообщение об ошибке
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Произошла ошибка'); // Выводим сообщение об ошибке
    }
  };

  const clearFormHandler = () => {
    setText(''); // Очищаем текст
    setTitle(''); // Очищаем заголовок
    setImage(null); // Очищаем изображение
  };

  return (
    <div>
      <div className={styles.main}>
        <div className={styles.wallpaper}>
          {/* Форма создания поста */}
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            {/* Загрузка изображения */}
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])} // Обработчик изменения файла
              accept="image/*" // Принимаем только изображения
            />

            {/* Предпросмотр изображения */}
            {image && (
              <div className={styles.imagePreview}>
                <img src={URL.createObjectURL(image)} alt="Предпросмотр" />{' '}
                {/* Отображаем предпросмотр */}
                <button type="button" onClick={() => setImage(null)}>
                  ×
                </button>{' '}
                {/* Кнопка удаления предпросмотра */}
              </div>
            )}

            {/* Заголовок поста */}
            <label>Заголовок поста:</label>
            <input
              type="text"
              placeholder="Заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)} // Обработчик изменения заголовка
              required
            />

            {/* Текст поста */}
            <label>Текст поста:</label>
            <textarea
              placeholder="Текст поста"
              value={text}
              onChange={(e) => setText(e.target.value)} // Обработчик изменения текста
              required
            />

            {/* Кнопка отправки */}
            <button onClick={submitHandler} disabled={loading}>
              {loading ? 'Публикация...' : 'Добавить'}
            </button>
            {/* Кнопка отмены */}
            <button type="button" onClick={clearFormHandler}>
              Отменить
            </button>

            {/* Линии и булавки (декоративные элементы) */}
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

export default AddPostPage;
