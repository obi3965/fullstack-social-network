import React, { Component } from 'react'
import { list } from './UserApi'
import { Link } from 'react-router-dom'
import image from '../images/avatar.png'

/**
* @author
* @class Users
**/

class Users extends Component {
  constructor() {
      super();
      this.state = {
          users: [],
          error:''
      };
  }

  componentDidMount() {
      list().then(data => {
        console.log(data);
          if (data.error) {
              console.log(data.error);
          } else {
              this.setState({ users: data });
          }
      });
  }

  renderUsers = users => (
      <div className="row">
          {users.map((user, i) => (
                <div className="card col-md-4" key={i}>
                    <img
                        style={{ height: "180px", width: "auto" }}
                        className="img-thumbnail"
                       src={image} alt={user.name}
                        
                    />
                    <div className="card-body">
                        <h5 className="card-title">{user.name}</h5>
                        <p className="card-text">{user.email}</p>
                        <Link
                            to={`/user/${user._id}`}
                            className="btn btn-raised btn-primary btn-sm"
                        >
                            View Profile
                        </Link>
                    </div>
                </div>
            ))}
      </div>
  );

  render() {
    const { users } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Users</h2>

                {this.renderUsers(users)}
            </div>
        );
  }
}

export default Users;


