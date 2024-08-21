import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import Dummy_post from "../dummy_post";
import Loader from "./Loader";
import axios from "axios";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/posts");
        // console.log(response)
        setPosts(response?.data);
      } catch (error) {
        console.log(error);
      }

      setIsLoading(false);
    };
    fetchPosts();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <section className="posts">
        {posts.length > 0 ? (
          <div className="container posts_container">
            {posts.map(
              ({
                _id: id,
                thumbnail,
                category,
                title,
                description,
                creator,
                createAt,
              }) => {
                return (
                  <PostItem
                    key={id}
                    PostId={id}
                    thumbnail={thumbnail}
                    title={title}
                    category={category}
                    description={description}
                    authorId={creator}
                    createAt={createAt}
                  />
                );
              }
            )}
          </div>
        ) : (
          <h2 className="center">No Posts Found</h2>
        )}
      </section>
    </>
  );
};

export default Posts;
