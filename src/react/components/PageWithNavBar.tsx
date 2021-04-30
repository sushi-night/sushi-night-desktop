import React from "react";
import { Route } from "react-router";
import { Profile } from "../navigation/pages/Profile";
import { Home } from "../navigation/pages/Home";
import { Settings } from "../navigation/pages/Settings";
import { AnimeDetails } from "../navigation/pages/AnimeDetails";
import { Watch } from "../navigation/pages/Watch";
import { Navbar } from "./Navbar";
import { Browse } from "../navigation/pages/Browse";

export const PageWithNavbar: React.FC = () => {
  return (
    <div>
      <Navbar />
      <Route exact path="/w/home" component={Home} />
      <Route exact path="/w/profile" component={Profile} />
      <Route exact path="/w/browse" component={Browse} />
      <Route exact path="/w/browse/:filter" component={Browse} />
      <Route exact path="/w/settings" component={Settings} />
      <Route exact path="/w/animeDetails" component={AnimeDetails} />
      <Route exact path="/w/watch" component={Watch} />
    </div>
  );
};
