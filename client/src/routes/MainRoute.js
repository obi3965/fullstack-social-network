import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../pages/Home";
import Signup from "../user/Signup";

export default function Mainroute() {

  return (
    <>
      <Switch>
        <Route path="/" exact component={ Home }></Route>
        <Route path="/signup" exact component={ Signup }></Route>
      </Switch>
    </>
  );
}
