import React, { useContext, useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory]= useState('uncategorized');
  const [description, setDescription]= useState('');
  const [thumbnail, setThumbnail]=useState('');
  const [error, setError] = useState('')


  // navigate 
  const navigate = useNavigate()
  
  // Access control using use context (user are not allow to access some url until he is not login)
  const {currentUser}  = useContext(UserContext);

  const token = currentUser?.token;

  // redirect to login page for any user who is not logged in 
  useEffect(() => {
    if(!token) {

      navigate('/login') 

      
    }
  }, [])



  const modules= {
    toolbar: [
      [{'header': [1,2,3,4, 5, 6 , false]}],
      ['bold', 'italic', 'underline', 'strike', 'blockqoute'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': +1}],
      ['link', 'image'],
      ['clean']
    ],
  }

  const formats= [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockqoute',
    'list', 'bullet','indent',
    'link','image'
  ]

  const Post_Categories = ['Agriculture', 'Business', 'Education', 'Entertainment', 'Art', 'Investment', 'Uncategorized', 'Weather' ]


  const createPost = async (e) => {
    e.preventDefault()
    const postData = new FormData();
    postData.set('title', title)
    postData.set('category', category)
    postData.set('description', description)
    postData.set('thumbnail', thumbnail)


    try {
      const response= await axios.post(`http://localhost:5000/api/posts/`, postData, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
      if(response.status == 200){
         navigate('/')
      }
    } catch (error) {
      setError(error.response.data.msg)
      
    }



  }


   
  return (
    <>
    <section className='create-post'> 
      <div className="container">
        <h2 className='center'>Create Post</h2>
        {error &&
        <p className='form-error-massage'>
          {error}
        </p>}
        <form action="#" className='form create-post-form' onSubmit={createPost}>
          <input type="text" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} autoFocus />
          <select name="category" id="category" value={category} onChange={e => setCategory(e.target.value)}>
{
  Post_Categories.map(cate => <option key={cate}> {cate} </option>)
} 

          </select>
<ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} className='q1-editor' /> 
<input type="file" onChange={e => setThumbnail(e.target.files[0])}  accept='png , jpg , jpeg'/>
<button type='submit' className='btn Primary'>Create</button>
             
        </form> 
      </div>
    </section>   
    </>
  )
}

export default CreatePost