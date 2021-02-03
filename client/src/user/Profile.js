import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { read } from "../user/UserApi";
import { Link, Redirect } from "react-router-dom";
import image from '../images/avatar.png'
import DeleteUser from "./DeleteUser";
import { API } from "../urlConfig";
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
            redirectToSignin: false,
            error: "",
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

componentWillReceiveProps(props) {
  const userId = props.match.params.userId;
  this.init(userId);
}

 render() {
  const { redirectToSignin, user } = this.state;
  if (redirectToSignin) return <Redirect to="/signin" />;
  const photoUrl = user._id
  ? `${API}/user/photo/${
      user._id
    }?${new Date().getTime()}`
  : image;

  return(
   <div className="container">
      <div className="row mt-4 mx-auto d-flex justify-content-center align-items-center">
          <div className="col-lg-4 col-md-6 col-sm-6 col-sm-12">
              <div className="profile">
              <img
              style={{ height: "200px", width: "auto" }}
              className="img-thumbnail"
              src={photoUrl}
              onError={i => (i.target.src = `${image}`)}
              alt={user.name}
            />
                  
              </div>
          </div>
          <div className="col-lg-8 col-md-6 col-sm-6 col-sm-12">
                  <p> Name {user.name}</p>
                  <p> email {user.email}</p>
                  <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
            {isAuthenticated().user._id === this.state.user._id && (
              <div className="d-inline-block mt-5">
                <Link
                  className="btn btn-raised btn-info "
                  to={`/user/edit/${user._id}`}
                >
                  edit profile
                </Link>

                <Link>
                 <DeleteUser userId={user._id}/>
                </Link>
              </div>
            )}
          </div>
      </div>

      <div className="row m-auto">
        <div className="col-md-4">
          <p>{user.about}</p>
        </div>
      </div>
   </div>
    )
   }
 }



export default Profile