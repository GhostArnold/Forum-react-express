import { useState } from 'react';
import { useDispatch } from 'react-redux';
import line from '../../assets/img/line.png';
import redPinning from '../../assets/img/red-pinning.png';
import { createPost } from '../../redux/features/post/postSlice';
import { useNavigate } from 'react-router-dom';
import styles from './AddPostPage.module.scss';
const AddPostPage = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = () => {
    try {
      const data = new FormData();
      data.append('title', title);
      data.append('text', text);
      data.append('image', image);
      dispatch(createPost(data));
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  const clearFormHandler = () => {
    setText('');
    setTitle('');
  };

  return (
    <div>
      <div className={styles.main}>
        <div className={styles.wallpaper}>
          <form
            action=""
            className={styles.form}
            onSubmit={(e) => e.preventDefault()}
          >
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            {/* ЧТобы картинка вставлялась при создании поста */}
            {/* <div className={styles.postImg}>
              {image && <img src={URL.createObjectURL(image)} alt="image" />}
            </div> */}
            <label htmlFor="title">Заголовок поста: </label>
            <input
              id="title"
              type="text"
              placeholder="Заголовок"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label htmlFor="textPost">Текст поста: </label>
            <textarea
              id="textPost"
              type="text"
              placeholder="Текст поста"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button onClick={submitHandler}>Добавить</button>
            <button onClick={clearFormHandler}>Отменить</button>
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
