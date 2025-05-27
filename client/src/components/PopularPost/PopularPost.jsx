import { Link } from 'react-router-dom';
const PopularPost = ({ post }) => {
  return (
    <div className="popular-post-item">
      <Link to={`posts/${post._id}`}>
        <h3>{post.title}</h3>
      </Link>
    </div>
  );
};

export default PopularPost;
