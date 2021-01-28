import React from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth";

import "../css/nav.css";
/**
 * @author
 * @function Nav
 **/
const isActive = (history, path) => {
  if (history.location.pathname === path) return { color: "#5d13e7" };
  else return { color: "#000" };
};

const Nav = ({ history }) => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Navbar
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  style={isActive(history, "/")}
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={
                    history.location.pathname === "/users"
                      ? "active nav-link"
                      : "not-active nav-link"
                  }
                  to="/users"
                >
                  users
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to={`/post/create`}
                  style={isActive(history, `/post/create`)}
                  className="nav-link"
                >
                  Create Post
                </Link>
              </li>
            </ul>

            <div className="user ml-auto d-flex justify-content-center align-items-center">
              {!isAuthenticated() && (
                <React.Fragment>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      style={isActive(history, "/signin")}
                      to="/signin"
                    >
                      signin
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      style={isActive(history, "/signup")}
                      to="/signup"
                    >
                      signup
                    </Link>
                  </li>
                </React.Fragment>
              )}
            </div>

            {isAuthenticated() && (
              <React.Fragment>
                <li className="nav-item">
                  <span
                    className="nav-link"
                    style={{ cursor: "pointer", color: "#5d13e7" }}
                    onClick={() => signout(() => history.push("/"))}
                  >
                    Sign Out
                  </span>
                </li>
              </React.Fragment>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default withRouter(Nav);
