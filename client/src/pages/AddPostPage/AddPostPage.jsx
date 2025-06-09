import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import line from '../../assets/img/line.png';
import redPinning from '../../assets/img/red-pinning.png';
import { createPost } from '../../redux/features/post/postSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './AddPostPage.module.scss';

// ПРАВИЛЬНЫЙ ИМПОРТ! Импортируем containsBadWords из utils/badWords.js
import { containsBadWords } from '../../utils/badWords.js';

const AddPostPage = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.post);

  const submitHandler = async () => {
    try {
      // Используем ИМПОРТИРОВАННУЮ функцию containsBadWords
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
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('text', text);
      if (image) formData.append('image', image);

      const resultAction = await dispatch(createPost(formData));

      if (createPost.fulfilled.match(resultAction)) {
        toast.success('Пост успешно создан!');
        navigate('/');
      } else if (createPost.rejected.match(resultAction)) {
        if (resultAction.payload?.type === 'badWords') {
          toast.error(resultAction.payload.message, {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'colored',
          });
        } else {
          toast.error('Ошибка при создании поста');
        }
      }
    } catch (error) {
      console.error(error);
      toast.error('Произошла ошибка');
    }
  };

  const clearFormHandler = () => {
    setText('');
    setTitle('');
    setImage(null);
  };

  return (
    <div>
      <div className={styles.main}>
        <div className={styles.wallpaper}>
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
            />

            {image && (
              <div className={styles.imagePreview}>
                <img src={URL.createObjectURL(image)} alt="Предпросмотр" />
                <button type="button" onClick={() => setImage(null)}>
                  ×
                </button>
              </div>
            )}

            <label>Заголовок поста:</label>
            <input
              type="text"
              placeholder="Заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label>Текст поста:</label>
            <textarea
              placeholder="Текст поста"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />

            <button onClick={submitHandler} disabled={loading}>
              {loading ? 'Публикация...' : 'Добавить'}
            </button>
            <button type="button" onClick={clearFormHandler}>
              Отменить
            </button>

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
