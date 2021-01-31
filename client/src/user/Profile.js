import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { read } from "../user/UserApi";
import { Link, Redirect } from "react-router-dom";
import image from '../images/avatar.png'
import DeleteUser from "./DeleteUser";
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
      <div className="row mt-4 mx-auto d-flex justify-content-center align-items-center">
          <div className="col-lg-4 col-md-6 col-sm-6 col-sm-12">
              <div className="profile">
                 <img
                        style={{ height: "", width: "100%" }}
                        className="img-thumbnail"
                       src={image} alt={user.name}
                        
                    />
                  
              </div>
          </div>
          <div className="col-lg-8 col-md-6 col-sm-6 col-sm-12">
                  <p> Name {user.name}</p>
                  <p> email {user.email}</p>
                  <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
            {isAuthenticated().user._id == this.state.user._id && (
              <div className="d-inline-block mt-5">
                <Link
                  className="btn btn-raised btn-info ml-3"
                  to={`/user/edit/${user._id}`}
                >
                  edit
                </Link>

                <Link>
                 <DeleteUser/>
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