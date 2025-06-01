import React from 'react'

import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <>
      <div className='flex justify-evenly items-center h-screen bg-gray-100'>

      <Link to="/hotel/login" className="btn btn-primary">
      Login
      </Link>
    
      <Link to="/hotel/registration" className="btn btn-primary">
      Register
      </Link>
      </div>
    
    
    </>
  )
}

export default HomePage