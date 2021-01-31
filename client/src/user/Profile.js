import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { read } from "../user/UserApi";
import { Link, Redirect } from "react-router-dom";
// import Delete from "./Delete";
/**
 * @author
 * @function Profile
 **/




/**
* @author
* @class Profile
**/

class Profile extends Component {
 constructor(){
    super()
        this.state = {
            user: '',
            redirectToSignin: false
        }
    }

    init = userId => {
        const token = isAuthenticated().token;
        read(userId, token).then(data => {
            
          if (data.error) {
            this.setState({ redirectToSignin: true });
          } else {
            
            this.setState({ user: data,});
           
          }
        });
      };
 
componentDidMount () {
  const userId = this.props.match.params.userId;
  this.init(userId)
}

 render() {
  const { redirectToSignin, user } = this.state;
  if (redirectToSignin) return <Redirect to="/signin" />;
  return(
   <div className="container">
      <div className="row mx-auto">
          <div className="col-lg-6 col-md-6 col-sm-6 col-sm-12">
              <div className="profile">
                  <p> Name {isAuthenticated().user.name}</p>
                  <p> email {isAuthenticated().user.email}</p>
                  <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
              </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6 col-sm-12">
            {isAuthenticated().user._id == this.state.user._id && (
              <div className="d-inline-block mt-5">
                <Link
                  className="btn btn-raised btn-info ml-3"
                  to={`/user/edit/${user._id}`}
                >
                  edit
                </Link>

                <Link
                  className="btn btn-raised btn-success ml-5"
                  to={`/user/delete/${user._id}`}
                >
                  delete
                </Link>
              </div>
            )}
          </div>
      </div>
   </div>
    )
   }
 }



export default Profile