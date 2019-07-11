import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Settings from "../pages/Settings";
import AddSensor from "../pages/AddSensor";
import Graphs from "../pages/Graph";
const RenderRoutes = () => (
  <Router>
    <div>
      <Route exact path="/" component={Dashboard} />
      <Route exact path="/addSensor" component={AddSensor} />
      <Route exact path="/settings" component={Settings} />
      <Route exact path="/graphs" component={Graphs} />
    </div>
  </Router>
);

export default RenderRoutes;
