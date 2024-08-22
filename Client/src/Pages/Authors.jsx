import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import authorData from '../data'
import axios from "axios";
import Loader from '../Components/Loader'



const Authors = () => {

  const [authors, setAuthors]= useState([]);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getAuthors = async () => {
      setIsLoading(true);
    
    try {
      const response = await axios.get(`http://localhost:5000/api/users`)
      setAuthors(response.data)
      
    } catch (error) {
      console.log(error)
      
    }
    setIsLoading(false)
  }
  getAuthors();
    


  },[])

  if(isLoading){
    return <Loader />
  }

  return <>
  
  <section className="authors"> 
    {authors.length > 0 ?
    <div className="container authors-container">{
        authors.map(({_id: id, avatar, name, post})=>{
          return <Link key={id} to={`/posts/users/${id}`} className="author" >
           
            <div className="author-avatar">
              <img src={`https://blog-site-mern.vercel.app/uploads/${avatar}`} alt={`Image of ${name}`} />
            </div>

            <div className="author-info">
              <h4>{name}</h4>
              <small>{post}</small>

            </div>
          </Link>


        }) 
      }

    </div>: <h2 className="center">No Author Found!</h2> }

  </section>
  </>;
};

export default Authors;
