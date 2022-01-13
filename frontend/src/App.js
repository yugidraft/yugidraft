// import logo from './logo.svg';
import "./App.css";
import Home from "./components/Home/Home";
import Lobby from "./components/Lobby/Lobby";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React from "react";
import CreateLobby from "./components/CreateLobby/CreateLobby";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/create-lobby">
          <CreateLobby />
        </Route>
        <Route path="/l/:roomId">
          <Lobby />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
