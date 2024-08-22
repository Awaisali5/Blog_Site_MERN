import React, { useState } from "react";
import { useEffect, useContext } from "react";
import { UserContext } from "../context/userContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Loader from '../Components/Loader'

const DeletePost = ({postId: id}) => { 
  // navigate
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)

  // Access control using use context (user are not allow to access some url until he is not login)
  const { currentUser } = useContext(UserContext);

  const token = currentUser?.token;

  // redirect to login page for any user who is not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  const removePost = async () => {
    setIsLoading(true)
    try {
      const res = await axios.delete(`https://blog-site-mern-qf7h.vercel.app/api/posts/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` }
      });
      if(res.status == 200){
        if(location.pathname == `/myposts/${currentUser.id}` ){
          navigate(0)
        }else {
          navigate('/')
        }

      }
      setIsLoading(false)
    } catch (error) {
      console.log(`Unable to Delete the Post `);
    }
  };


  if(isLoading){
    return <Loader />
  }
  return (
    <>
      <Link className="btn sm danger" onClick={() => removePost({ id })}>
        Delete
      </Link>
    </>
  );
};

export default DeletePost;
