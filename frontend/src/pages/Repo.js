import TrafficAnalytics from '../components/TrafficAnalytics'; 
import StarAnalytics from '../components/StarAnalytics'; 
import RepoSetting from '../components/RepoSetting'; 
import RepoNav from '../components/RepoNav'; 

import './Repo.css';
import React from "react";
import Footer from '../components/Footer';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  useLocation,
} from "react-router-dom";

function Repo () {
  const match = useRouteMatch();
  const location = useLocation();
  const username = match.params.username;
  const repo = match.params.repo;
  const repoPath = `${username}/${repo}`

  return (
    <div >
      <Switch>
        <Route path={`${match.path}/traffic`}>
          <RepoNav repoPath={repoPath} selectedTab={0} />
          <TrafficAnalytics repoPath={repoPath}/>
        </Route>
        <Route path={`${match.path}/stars`}>
          <RepoNav repoPath={repoPath} selectedTab={1} />
          <StarAnalytics repoPath={repoPath}/>
        </Route>
        <Route path={`${match.path}/settings`}>
          <RepoNav repoPath={repoPath} selectedTab={2} />
          <RepoSetting />
        </Route>
        <Route path={`${match.path}`}>
          <RepoNav repoPath={repoPath} selectedTab={0} />
          <TrafficAnalytics repoPath={repoPath}/>
        </Route>
      </Switch>

      <div className="repo-container">
        <Footer />
      </div>
    </div>
  );
}

export default Repo;