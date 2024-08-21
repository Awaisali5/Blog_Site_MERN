import React from "react";
import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";

const PostItem = ({
  PostId,
  thumbnail,
  category,
  title,
  description,
  authorId,
  createAt,
}) => {
  const shortDesc =
    description.length > 130
      ? description.substr(0, 130) + "......"
      : description;
  const PostTitle =
    description.length > 50 ? description.substr(0, 30) + "......" : title;

  return (
    <>
      <article className="post">
        <div className="post_thumbnail">
          <img src={`http://localhost:5000/uploads/${thumbnail}`} alt={title} />
        </div>
        <div className="post_content">
          <Link to={`/posts/${PostId}`}>
            <h3>{PostTitle}</h3>
          </Link>
          <p>{shortDesc}</p>

          <div className="post_footer">
            <PostAuthor authorId={authorId} createAt={createAt} />

            <Link to={`/posts/categories/${category}`} className="btn category">
              {" "}
              {category}
            </Link>
          </div>
        </div>
      </article>
    </>
  );
};

export default PostItem;
