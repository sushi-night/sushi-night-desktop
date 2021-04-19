import React, { useEffect, useState } from "react";
import { MemoryRouter as Router, Route, Switch } from "react-router-dom";
import { Account } from "./pages/Account";
import { AnimeDetails } from "./pages/AnimeDetails";
import { Home } from "./pages/Home";
import { Welcome } from "./pages/Welcome";
import { Settings } from "./pages/Settings";
import { Watch } from "./pages/Watch";
import { useWelcomeStore } from "../zustand";

//will use global state with zustand instead of route parameters.
export const Routes: React.FC = () => {
  const { welcome } = useWelcomeStore();
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={welcome ? Home : Welcome} />
        <Route exact path="/login" component={Welcome} />
        <Route exact path="/account" component={Account} />
        <Route exact path="/settings" component={Settings} />
        <Route exact path="/animeDetails" component={AnimeDetails} />
        <Route exact path="/watch" component={Watch} />
      </Switch>
    </Router>
  );
};
