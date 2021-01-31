import React from "react";
import { Route, Switch } from "react-router-dom";
import Nav from '../pages/Nav'
import Home from "../pages/Home";
import Signin from "../user/Signin";
import Signup from "../user/Signup";
import Users from "../user/Users";
import Profile from "../user/Profile";

export default function Mainroute() {

  return (
    <>
    <Nav />
      <Switch>
      
        <Route path="/" exact component={ Home }></Route>
        <Route path="/signup" exact component={ Signup }></Route>
        <Route path="/signin" exact component={ Signin }></Route>
        <Route path="/users" exact component={ Users }></Route>
        <Route path="/user/:userId" exact component={ Profile }></Route>
      </Switch>
    </>
  );
}
