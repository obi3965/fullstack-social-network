import React,{ useState } from 'react'
import { Link } from 'react-router-dom';
import { signup } from '../auth'


import '../css/signup.css'

const Signup = () => {
    const [values, setValues] = useState({
        name: '',
        email:'',
        password:'',
        error: '',
        success: false
    });

    const { name, email, password, success, error } = values;

    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    const clickSubmit = event => {
        event.preventDefault();
        setValues({ ...values, error: false });
        signup({ name, email, password }).then(data => {
            if (data.error) {
                setValues({ ...values, error: data.error, success: false });
            } else {
                setValues({
                    ...values,
                    name: '',
                    email: '',
                    password: '',
                    error: '',
                    success: true
                });
            }
        });
    };


   


    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            New account is created. Please <Link to="/signin">Signin</Link>
        </div>
    )

    return (
        <div className="container">
            
        <div className="col-md-6 mx-auto text-center">
          <div className="header-title">
            <h1 className="wv-heading--title">
              Check out — it’s free!
            </h1>
            <h2 className="wv-heading--subtitle">
              Lorem ipsum dolor sit amet! Neque porro quisquam est qui do dolor amet, adipisci velit...
            </h2>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 mx-auto">
            <div className="myform form ">
              <form name="login">
                <div className="form-group mt-1">
                  <input type="text" name="name" value={name} onChange={handleChange('name')} className="form-control my-input" id="name" placeholder="Name" autoComplete="off"  />
                </div>
                <div className="form-group mt-2">
                  <input type="email" name="email" value={ email } onChange={handleChange('email')} className="form-control my-input" id="email" placeholder="Email" autoComplete="off" />
                </div>
                <div className="form-group mt-2">
                  <input type="password" value={ password } onChange={handleChange('password')} name="password" id="password" className="form-control my-input" placeholder="Your Password" autoComplete="off"  />
                </div>
                <div className="text-center mt-2 ">
                  <button type="submit"  onClick={clickSubmit} className=" btn btn-block send-button tx-tfm">signup</button>
                </div>
                <div className="col-md-12 ">
                  <div className="login-or">
                    <hr className="hr-or" />
                    <span className="span-or">or</span>
                  </div>
                </div>
                <div className="form-group">
                  {/* <Link className="btn btn-block g-button" href="#">
                    <i className="fa fa-google" /> Sign up with Google
                  </Link> */}
                </div>
                
              </form>
            </div>
            {showSuccess()}
            {showError()}
          </div>
        </div>
      </div>
    )
}

export default Signup
