import React, { useState } from "react";
import { signin, authenticate } from "../auth";
import { Link, Redirect } from "react-router-dom";
/**
 * @author
 * @function Signin
 **/

const Signin = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    redirectToRefer: false,
  });
  const { email, password, loading, error, redirectToRefer } = values;
  const handleChange = (name) => (event) => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signin({ email, password }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        authenticate(data, () => {
          setValues({
            ...values,
            redirectToRefer: true,
          });
        });
      }
    });
  };

  if (redirectToRefer) {
    return <Redirect to="/" />;
  }

  const signInForm = () => (
    <form name="login">
      <div className="form-group mt-2">
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange("email")}
          className="form-control my-input"
          id="email"
          placeholder="Email"
          autoComplete="off"
        />
      </div>
      <div className="form-group mt-2">
        <input
          type="password"
          value={password}
          onChange={handleChange("password")}
          name="password"
          id="password"
          className="form-control my-input"
          placeholder="Your Password"
          autoComplete="off"
        />
      </div>
      <div className="text-center mt-2 ">
        <button
          type="submit"
          onClick={clickSubmit}
          className=" btn btn-block send-button tx-tfm"
        >
          signin
        </button>
      </div>
      <div className="col-md-12 ">
        <div className="login-or">
          <hr className="hr-or" />
          <span className="span-or">or</span>
        </div>
      </div>
      <div className="form-group">
        <Link className="btn btn-block g-button" to="/signup">
          <i className="fa fa-google" /> Sign up
        </Link>
      </div>
    </form>
  );

  const showError = () => (
    <div
      className="alert bg-danger alert-danger text-white"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showLoading = () =>
    loading && (
      <div className="alert alert-info">
        <h2>Loading...</h2>
      </div>
    );

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4 mx-auto">
          {showLoading()}
          {showError()}
          {signInForm()}
        </div>
      </div>
    </div>
  );
};

export default Signin;
