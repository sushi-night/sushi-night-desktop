import React from "react";
import { Route } from "react-router";
import { Profile } from "../navigation/pages/Profile";
import { Home } from "../navigation/pages/Home";
import { Settings } from "../navigation/pages/Settings";
import { Navbar } from "./Navbar";

export const PageWithNavbar: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Route exact path="/w/home" component={Home} />
      <Route exact path="/w/profile" component={Profile} />
      <Route exact path="/w/settings" component={Settings} />
    </div>
  );
};
