import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import Home from './pages/Home';
import User from './pages/User';


export default function BasicExample() {
  return (
    <Router>
      <header>
        <div className="header-left">
          <img src="/logo.png" alt="logo" width="30px"/>
          &nbsp;
          <Link to="/" className="header-link">Repo Analytics</Link>
        </div>
        <div>
          <Link to="/about" className="header-link">Sign in with GitHub</Link>
          {/* <Link to="/topics">Topics</Link> */}
        </div>
      </header>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />

      <Route exact path="/:username" component={User} />
      <Route exact path="/:username/:repo" component={User} />
    </Router>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Topics({ match }) {
  return (
    <div>
      <h2>Topics</h2>
      <ul>
        <li>
          <Link to={`${match.url}/rendering`}>Rendering with React</Link>
        </li>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
        </li>
      </ul>

      <Route path={`${match.path}/:topicId`} component={Topic} />
      <Route
        exact
        path={match.path}
        render={() => <h3>Please select a topic.</h3>}
      />
    </div>
  );
}

function Topic({ match }) {
  return (
    <div>
      <h3>{match.params.topicId}</h3>
    </div>
  );
}