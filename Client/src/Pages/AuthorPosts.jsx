import React, { useState, useEffect } from 'react'
import PostItem from '../Components/PostItem';
import Loader from '../Components/Loader'
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AuthorPosts = () => {
  const [posts, setPosts]= useState([])
  const [isLoading, setIsLoading] = useState(false)

  const {id} = useParams()


  useEffect(() => {

    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://blog-site-mern.vercel.app/api/posts/users/${id}` )
        console.log(response.data)
        setPosts(response?.data)
        
      } catch (error) {
        console.log(error)
        
      }

      setIsLoading(false)

    } 
    fetchPosts();  
  }, [id])
  
  if(isLoading){
    return <Loader />
  }

return (
  <>
  <section className='posts'>

      {posts.length  > 0 ? <div className="container posts_container">

      {
          posts.map(({_id: id,thumbnail,category,title, description, creator, createAt}) =>{ 
          
          return <PostItem
          key={id}  PostId={id}  thumbnail={thumbnail} title={title} category={category} description={description} authorId={creator}   createAt = {createAt}/>} )
      }
      </div> : <h2 className='center'>No Posts Found</h2> }

     
  </section>
  </>
)
}

export default AuthorPosts