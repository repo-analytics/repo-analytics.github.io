import React, { useEffect, useState } from "react";
import http from '../utils/http';
import RepoLoader from "../components/RepoLoader";
import ProjectCard from '../components/ProjectCard';
import './User.css';
import userSignedIn from '../utils/userSignedIn';
import VisitChart from '../components/VisitChart';
import CloneChart from '../components/CloneChart';
import './Repo.css';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';

function Repo ({ match }) {
  const username = match.params.username;
  const repo = match.params.repo;
  const [trafficData, setTrafficData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);
    http.getRepoTraffic({
      repoPath: `${username}/${repo}`,
    })
      .then(traffic => {
        setTrafficData(traffic);
        setIsLoading(false);
      })
      .catch(err => console.log(err));
  }, [])

  return (
    <div >
      <div className="repo-header">
        <div className="repo-container">
          <h1 className="repo-title">
            <a className="user-github-link" href={`https://github.com/${username}/${repo}`}>
              {`${username}/${repo}`}<i className="ri-github-line"></i>
            </a>
          </h1>
          <nav className="repo-nav">
            <a href className="selected">Traffics</a>
            <a href>Star analytics</a>
          </nav>
        </div>
      </div>
      <div className="repo-container">
        <div className="date-picker-container">
          {/* <a href className="selected">All</a>
          <a href>Last month</a>
          <a href>Last 14 days</a> */}
          Recoding analytics since
          <br/>
          updated at
        </div>
        { isLoading ? <RepoLoader/> : ''}
        { trafficData.views ? <VisitChart trafficData={trafficData}/>  : ''}
        { trafficData.clones ? <CloneChart trafficData={trafficData}/>  : ''}
      </div>
    </div>
  );
}

export default Repo;