import React from 'react'
import { Link } from 'react-router-dom'

export const Gotologin = () => {
  return (
    <div className='golog'>
    <Link to="/login">
    <h1>Go to Login Page</h1>
    </Link>
    </div>
  )
}
