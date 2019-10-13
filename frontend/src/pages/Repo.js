import React, { useEffect, useState } from "react";
import http from '../utils/http';
import RepoLoader from "../components/RepoLoader";
import './User.css';
import VisitChart from '../components/VisitChart';
import CloneChart from '../components/CloneChart';
import './Repo.css';
import Footer from '../components/Footer';

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
            <a href className="selected">Traffic</a>
            <a href>Star analytics</a>
          </nav>
        </div>
      </div>
      <div className="repo-container">
        {
          trafficData.repoCreatedAt ? 
            <div className="dates-container">
              <p>Updated at {trafficData.date}</p>
              <p>Recoding analytics since {trafficData.repoCreatedAt.slice(0, 10)}</p>
            </div> 
            : ''
        }
        { isLoading ? <RepoLoader/> : ''}
        { trafficData.views ? <VisitChart views={trafficData.views}/>  : ''}
        { trafficData.clones ? <CloneChart clones={trafficData.clones}/>  : ''}
        { !trafficData.referrers ? '' : 
          <div className="repo-ref-paths-container">
            <div className="one-ref-path">
              <h3 className="chart-container-header"> Referring sites </h3>
              <table>
                <thead>
                  <tr>
                    <th>Site</th>
                    <th>Views</th>
                    <th>Unique visitors</th>
                  </tr>
                </thead>
                <tbody>
                  {trafficData.referrers.map(referrer => <tr>
                    <td>{referrer.referrer}</td>
                    <td>{referrer.count}</td>
                    <td>{referrer.uniques}</td>
                  </tr>)}
                </tbody>
              </table>
            </div>
            <div className="one-ref-path">
              <h3 className="chart-container-header"> Popular content </h3>
              <table>
                <thead>
                  <tr>
                    <th>Content</th>
                    <th>Views</th>
                    <th>Unique visitors</th>
                  </tr>
                </thead>
                <tbody>
                  {trafficData.paths.map(path => <tr>
                    <td><a href={`https://github.com/${path.path}`}>{path.path}</a></td>
                    <td>{path.count}</td>
                    <td>{path.uniques}</td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        }
        
        <Footer />
      </div>
    </div>
  );
}

export default Repo;