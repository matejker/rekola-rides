import React from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import RekolaRides from "./RekolaRides";
import RekolaClusters from "./RekolaClusters";
import StochasticRates from "./StochasticRates";
import MarkovChain from "./MarkovChain";
import Home from "./Home";

import github from "./img/github.png";

import "./main.css";
import "katex/dist/katex.min.css";

export default function App() {
  return (
    <Router>
      <div className="App">
        <div id="main">
          <h1>
            <Link to={"/"} className={"no-style"}>
              Rekola Rides
            </Link>
          </h1>
          <em className="description">
            Mobility patterns in Bratislava and predicting demands for bike-sharing from Rekola
          </em>

          <h2>Chapters</h2>
          <ol id={"chapters"}>
            <li>
              <Link to="/">Intro</Link>
            </li>
            <li>
              <Link to="/rekola-rides">Rekola rides</Link>
            </li>
            <li>
              <Link to="/rekola-clusters">Rekola station clusters</Link>
            </li>
            <li>
              <Link to="/markov-chains">Markov chains</Link>
            </li>
            <li>
              <Link to="/stochastic-rates">Stochastic rates</Link>
            </li>
          </ol>

          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/rekola-rides">
              <RekolaRides />
            </Route>
            <Route path="/rekola-clusters">
              <RekolaClusters />
            </Route>
            <Route path="/stochastic-rates">
              <StochasticRates />
            </Route>
            <Route path="/markov-chains">
              <MarkovChain />
            </Route>
          </Switch>
        </div>
        <footer>
          &copy; Matej Kerekrety 2023 - {new Date().getFullYear()}
          &nbsp;
          <a href="https://github.com/matejker/cyklo-bratislava">
            <img src={github} />
          </a>
        </footer>
      </div>
    </Router>
  );
}
