import React, { useContext, useEffect, useState } from "react";
import PostAuthor from "../Components/PostAuthor";
import { Link, useParams } from "react-router-dom";
import Thumbnail from "../assets/blog22.jpg";
import { UserContext } from "../context/userContext";
import Loader from "../Components/Loader";
import DeletePost from "./DeletePost";
import axios from "axios";

const PostDetails = () => {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [creatorId, setCreatorId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useContext(UserContext);
 
 

  // fatching the data from the database

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://blog-site-mern.vercel.app/api/posts/${id}`
        );
        setPost(response.data);
       

  
      } catch (error) {
        setError(error);
      }
      setIsLoading(false);
    };
    // calling the function
    getPost();
  }, []);

  // loading if the data is fetching form the database
 

  if (isLoading) {
    return <Loader />;
  }
  

  return (
    <>
      <section className="post_details">
        {error && <p className="error">{error}</p>}

        {post && (
          <div className="container post-detail-container">
            <div className="post-detail-header">
              <PostAuthor authorId={post.creator} createAt={post.createdAt}/>

              {currentUser.userId == post.creator && (<div className="post-detail-button">
                  <Link to={`/posts/${post._id}/edit`} className="btn sm Primary">
                    Edit
                  </Link>
                  <DeletePost postId={id}/>
                </div>
              )}
            </div>

            <h1>{post.title}</h1>
            <div className="post-detail-thumbnail">
              <img
                src={`https://blog-site-mern.vercel.app/uploads/${post.thumbnail}`}
                alt=""
              />
            </div>
            <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
          </div>
        )}
      </section>
    </>
  );
};

export default PostDetails;
