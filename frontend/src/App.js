import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import Home from './pages/Home';
import User from './pages/User';
import queryString from 'query-string';

export default function App() {
  let user = {};

  if (window.location.search.length > 0) {
    try {
      const userFromSearch = queryString.parse(window.location.search);
      window.localStorage.setItem('user', JSON.stringify(userFromSearch));
      window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
      user = userFromSearch;
    } catch (err) {
      console.log('bad query string');
    }
  } else {
    const userRaw = window.localStorage.getItem('user');
    if (userRaw) {
      const userFromLocalStorage = JSON.parse(userRaw);
      if(userFromLocalStorage.username) user = userFromLocalStorage;
    }
  }

  return (
    <Router>
      <header>
        <div className="header-left">
          <img src="/logo.png" alt="logo" width="30px"/>
          &nbsp;
          <Link to="/" className="header-link">Repo Analytics</Link>
        </div>
        <div>
          {
            user.username ? 
            <div class="dropdown">
              <a className="header-link" href>{user.username} <span style={{fontSize:'10px'}}>▼</span></a>
              <div class="dropdown-content">
                <a href={`/${user.username}`}>Your profile</a>
                <a href="#">Add repo</a>
                <hr/>
                <a href="#">Sign out</a>
              </div>
            </div>
            :
            <a className="header-link" href="https://repo-analytics.t9t.io/auth/github">Sign in with GitHub</a>
          }
          
          {/* <Link to="/topics">Topics</Link> */}
        </div>
      </header>
      <Route exact path="/" >
        <Home user={user}/>
      </Route>
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