import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import Avatar from '../assets/avatar2.jpg'
import axios from "axios";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";
// import ru from 'javascript-time-ago/locale/ru.json'

TimeAgo.addDefaultLocale(en);
// TimeAgo.addLocale(ru)



const PostAuthor = ({ authorId, createAt }) => {

  const isValidDate = !isNaN(new Date(createAt).getTime());

 
  const [author, setAuthor] = useState({});

  useEffect(() => {
    const getAuthor = async () => {
      try { 
        const res = await axios.get(
          `https://blog-site-mern.vercel.app/api/users/${authorId}`
        );
        setAuthor(res?.data);
        // console.log(res.data)
      } catch (error) {
        console.log("Error aa gaya get author mai");
      }
    };
    getAuthor();
  }, []);

  return (
    <div className="post_author">
      <Link to={`/posts/users/${authorId}`}>
        <div className="post_author_avatar">
          <img
            src={`http://localhost:5000/uploads/${author?.avatar}`}
            alt=""
          />
          {/* <img src={Avatar} alt="" /> */}
        </div>
        <div className="post_author_details">
          <h5>By: {author.user?.name}</h5>
          <small>
    {isValidDate ? (
      <ReactTimeAgo date={new Date(createAt)} locale='en-US' />
    ) : (
      '17 mint ago'
    )}
  </small>
        </div>
      </Link>
    </div>
  );
};

export default PostAuthor;
