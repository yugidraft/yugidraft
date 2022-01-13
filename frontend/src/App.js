// import logo from './logo.svg';
// import './App.css';
import React from 'react';
import Home from './components/Home/Home';
import Lobby from './components/Lobby/Lobby';
import CreateGame from "./components/CreateGame/CreateGame";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/l/:roomId">
          <Lobby />
        </Route>
        <Route path="/create-game">
          <CreateGame />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
