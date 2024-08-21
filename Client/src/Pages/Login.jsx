import React, { useState , useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'

import {UserContext} from '../context/userContext'

const Login = () => {
  const [userData, setUserData]= useState({
    email: '',
    password: '',
  });

  // error 
  const [error, setError] = useState("")

  // navigate 
  const navigate = useNavigate();

  // setting user 
  const {setCurrentUser} = useContext(UserContext)


  // user Login 
  const loginUser = async (e) => {
    e.preventDefault();
    setError("")

    try {
      const response = await axios.post("http://localhost:5000/api/users/login",userData )
      // console.log(response)
      const user = await response.data;
      setCurrentUser(user)
      navigate('/')



      
    } catch (error) {
      setError(error.response.data.msg)
      
    }

  }








  const ChangeInputHandler = (e) => {
    setUserData(preState => {
      return {...preState, [e.target.name]: e.target.value }
    })
  }
  return (
    <>
    <section className='login'>
      <div className="container">
        <h2>Login</h2>

        <form action="#" className='form register-form' onSubmit={loginUser}>
{error && <p className='form-error-massage'>{error} </p> }



<input type="text" name="email" id="email" placeholder='Email' value={userData.email} onChange={ChangeInputHandler} autoFocus/>


<input type="text" name="password" id="password" placeholder='Password' value={userData.password} onChange={ChangeInputHandler}/>



<button type="submit" className='btn Primary'>Register</button>
        </form>

        <small>Don't Have an Account? <Link to={`/register`} className='sm'>Sign up</Link></small>
      </div>
    </section>
    </>
  )
}

export default Login