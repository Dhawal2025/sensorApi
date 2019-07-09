import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";

const RenderRoutes = () => (
  <Router>
    <div>
      <Route exact path="/" component={Dashboard} />
      <Route exact path="/settings" component={Settings} />
    </div>
  </Router>
);

export default RenderRoutes;
