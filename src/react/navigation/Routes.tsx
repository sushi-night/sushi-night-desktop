import React from "react";
import {
  MemoryRouter as Router,
  Link as RouterLink,
  Route,
  Switch,
} from "react-router-dom";
import { Account } from "./Account";
import { Home } from "./Home";
import { Login } from "./Login";
import { Settings } from "./Settings";

export const Routes: React.FC = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/account" component={Account} />
          <Route exact path="/settings" component={Settings} />
        </Switch>
        <nav>
          <div>
            <ul>
              <li>
                <RouterLink to="/">Home</RouterLink>
              </li>
              <li>
                <RouterLink to="/login">Login</RouterLink>
              </li>
              <li>
                <RouterLink to="/account">Account</RouterLink>
              </li>
              <li>
                <RouterLink to="/settings">Settings</RouterLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </Router>
  );
};
