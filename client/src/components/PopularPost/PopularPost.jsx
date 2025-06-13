import { Link } from 'react-router-dom';

const PopularPost = ({ post }) => {
  return (
    <div className="popular-post-item">
      {/* Ссылка на страницу поста */}
      <Link to={`posts/${post._id}`}>
        {/* Заголовок поста */}
        <h3>{post.title}</h3>
      </Link>
    </div>
  );
};

export default PopularPost;
