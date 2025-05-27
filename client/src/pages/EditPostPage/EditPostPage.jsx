import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import line from '../../assets/img/line.png';
import redPinning from '../../assets/img/red-pinning.png';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axios.js';
import { updatePost } from '../../redux/features/post/postSlice';
import styles from './EditPostPage.module.scss';
const EditPostPage = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [newImage, setNewImage] = useState('');
  // const [oldImage, setOldImage] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const fetchPost = useCallback(async () => {
    const { data } = await axios.get(`/posts/${params.id}`);
    setTitle(data.text);
    setText(data.text);
    // setOldImage(data.imgUrl);
  }, [params.id]);

  const submitHandler = () => {
    try {
      const updatedPost = new FormData();
      updatedPost.append('title', title);
      updatedPost.append('text', text);
      updatedPost.append('id', params.id);
      updatedPost.append('image', newImage);
      dispatch(updatePost(updatedPost));
      navigate('/my-posts');
    } catch (error) {
      console.log(error);
    }
  };
  const clearFormHandler = () => {
    setTitle('');
    setText('');
  };

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return (
    <div>
      <div className={styles.main}>
        <div className={styles.wallpaper}>
          <form
            action=""
            className={styles.form}
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="file"
              onChange={(e) => {
                setNewImage(e.target.files[0]);
                // setOldImage('');
              }}
            />
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
            <button onClick={submitHandler}>Редактировать</button>
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

export default EditPostPage;
