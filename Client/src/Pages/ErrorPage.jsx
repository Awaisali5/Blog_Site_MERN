import React from 'react'
import {Link} from 'react-router-dom'

const ErrorPage = () => {
  return (
    <>
    <section className='ErrorPage'>
      <div className="center">
        <Link to='/' className='btn Primary'>Go Back Home</Link>
        <h2>Page Not Found!</h2>
      </div>


    </section>
    </>
  )
}

export default ErrorPage