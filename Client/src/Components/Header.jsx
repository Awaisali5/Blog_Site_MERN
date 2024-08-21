import React, { useState } from 'react'
import {Link} from "react-router-dom"
import avatar1 from "../assets/blog.png"
import {FaBars} from 'react-icons/fa'
import {AiOutlineClose} from 'react-icons/ai'
import { UserContext } from '../context/userContext'
import { useContext } from 'react'

const Header = () => {
  const [isNavShowing, setIsNavShowing]=useState(window.innerWidth > 740 ? true : false);

  const {currentUser} = useContext(UserContext)

  const closeNavHandler = () => {
    if(window.innerWidth < 740){
      setIsNavShowing(false);
  }else {
    setIsNavShowing(true);
  }
  }
  return (
    <> 
    
    <nav>
      <div className="container nav_container" >
        <Link to="/" className='nav_logo' onClick={closeNavHandler}>
        <img src={avatar1} alt="logo" className='nav_logo'  />
        </Link>
{currentUser?.userId &&  isNavShowing &&  
        <ul className="nav_menu">

          <li><Link to={`Profile/${currentUser.userId}`} onClick={closeNavHandler} style={{color:'white', backgroundColor:'green', padding:'10px'}}>{currentUser?.name}</Link></li>
          <li><Link to="/" onClick={closeNavHandler}>Home</Link></li>

          <li><Link to="/create" onClick={closeNavHandler}>Create Post</Link></li>
          <li><Link to="/authors" onClick={closeNavHandler}>Authors</Link></li>
          <li><Link to="/logout" onClick={closeNavHandler}>Logout</Link></li>
          
        </ul>}
        {!currentUser?.userId &&  isNavShowing &&  
        <ul className="nav_menu">
          <li><Link to="/" onClick={closeNavHandler}>Home</Link></li>

          <li><Link to="/authors" onClick={closeNavHandler}>Authors</Link></li>
          <li><Link to="/login" onClick={closeNavHandler}>Login</Link></li>
          
        </ul>}
        <button className="nav_toggle-btn" onClick={()=> setIsNavShowing(!isNavShowing)}>
          {isNavShowing ? <AiOutlineClose /> : <FaBars />}
            
        </button>



      </div>
    </nav>
    </>
  )
}

export default Header