import React, { useState } from "react";
import Dummy_post from "../dummy_post";
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import Loader from "../Components/Loader";
import axios from "axios";
import DeletePost from '../Pages/DeletePost'

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  // navigate
  const navigate = useNavigate();

  // Access control using use context (user are not allow to access some url until he is not login)
  const { currentUser } = useContext(UserContext);

  const token = currentUser?.token;

  // redirect to login page for any user who is not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  //  to get the post that belong to current user

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);

      try {
        const res = await axios.get(
          `https://blog-site-mern.vercel.app/api/posts/users/${id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      // console.log(res)

        setPosts(res.data)
      } catch (error) {
        console.log(error)
      }

      setIsLoading(false )
    };
    fetchPosts();
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <section className="dashboard">
        {posts.length ? (
          <div className="container dashboard-container">
            {posts.map((post) => {
              return (
                <article key={post._id} className="dashboard-post">
                  <div className="dashboard-post-info">
                    <div className="dashboard-post-thumbnail">
                      <img src={post.thumbnail} alt="" />
                    </div>
                    <h5>{post.title}</h5>
                  </div>
                  <div className="dashboard-post-actions">
                    <Link to={`/posts/${post._id}`} className="btn sm">
                      View
                    </Link>
                    <Link
                      to={`/posts/${post._id}/edit`}
                      className="btn sm Primary"
                    >
                      Edit
                    </Link>
                    <DeletePost postId={post._id} />
                  
                    


                  
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <h2 className="center">No Post Found</h2>
        )}
      </section>
    </>
  );
};

export default Dashboard;
