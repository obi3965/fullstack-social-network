import React from 'react'
import { Link } from 'react-router-dom'
import '../css/nav.css'
/**
* @author
* @function Nav
**/

const Nav = () => {
  return(
   <>
   <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand" href="#">Navbar</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="">Link</Link>
              </li>
          
              <li className="nav-item">
                <Link className="nav-link" to="">Disabled</Link>
              </li>
              
            </ul>
           <div className="user ml-auto d-flex justify-content-center align-items-center">
            <li className="nav-item">
                <Link className="nav-link" to="/signin">signin</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/signup">signup</Link>
              </li>
            </div>
          
        </div>
          </div>
      </nav>
   </>
   )

 }

export default Nav