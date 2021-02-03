import React from "react";
import { Route, Switch } from "react-router-dom";
import Nav from '../pages/Nav'
import Home from "../pages/Home";
import Signin from "../user/Signin";
import Signup from "../user/Signup";
import Users from "../user/Users";
import Profile from "../user/Profile";
import EditProfile from "../user/EditProfile";
import PrivateRoute from '../auth/PrivateRoute'

export default function Mainroute() {

  return (
    <>
    <Nav />
      <Switch>
      
        <Route path="/" exact component={ Home }></Route>
        <Route path="/signup" exact component={ Signup }></Route>
        <Route path="/signin" exact component={ Signin }></Route>
        <Route path="/users" exact component={ Users }></Route>
        <PrivateRoute path="/user/edit/:userId" exact component={ EditProfile } />
        <PrivateRoute path="/user/:userId" exact component={ Profile } />
      </Switch>
    </>
  );
}
