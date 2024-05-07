import React from 'react'
import { Link } from 'react-router-dom'

export const Gotologin = () => {
  return (
    <div className='golog'>
      <br />
      <br />
      <br />
      <img src="https://postimg.cc/p9r4KTz5" alt="" />
      <h1>बड़ा पर्दा , बुलंद <br />
        आवाज़ <br />
        मनोरंजन का <br />
        नया अन्दाज़।</h1>
      <br />
      <br />
      <Link to="/home">
        <button>
          Go to Login Page</button>
      </Link>
    </div>
  )
}
