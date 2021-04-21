import React from "react";
import {
  MemoryRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { Welcome } from "./pages/Welcome";
import { useWelcomeStore } from "../zustand";
import { PageWithNavbar } from "../components/PageWithNavBar";

//will use global state with zustand instead of route parameters.
export const Routes: React.FC = () => {
  const { welcome } = useWelcomeStore();
  return (
    <Router>
      <Switch>
        <Route
          exact
          path="/"
          render={() =>
            !welcome ? <Redirect to="/login" /> : <Redirect to="/w/home" />
          }
        />
        <Route path="/w/" component={PageWithNavbar} />
        <Route exact path="/login" component={Welcome} />
      </Switch>
    </Router>
  );
};
