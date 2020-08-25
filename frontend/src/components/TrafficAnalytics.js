import React, { useEffect, useState } from "react";
import VisitChart from './VisitChart';
import CloneChart from './CloneChart';
import RepoLoader from "./RepoLoader";
import ReferrerChart from "./ReferrerChart";
import PathChart from "./PathChart";
import http from '../utils/http';

const Traffic = ({ repoPath }) => {
  const [trafficData, setTrafficData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    http.getRepoTraffic({
      repoPath,
    })
      .then(traffic => {
        setTrafficData(traffic);
        setIsLoading(false);
      })
      .catch(err => console.log(err));
  }, []);

  if (isLoading || !trafficData) {
    return <div className="repo-container">
      <RepoLoader/>
    </div>
  }

  return (<div className="repo-container">
    <div className="dates-container">
      <p>Updated at {trafficData.date}</p>
      <p>Recording analytics since {trafficData.repoCreatedAt.slice(0, 10)}</p>
    </div> 

    <div className="repo-ref-paths-container">
      <div className="one-ref-path">
        <VisitChart views={trafficData.views}/> 
      </div>
      <div className="one-ref-path">
        <CloneChart clones={trafficData.clones}/>
      </div>
    </div>


    <div className="repo-ref-paths-container">
      <div className="one-ref-path">
        <ReferrerChart referrers={trafficData.referrers}/>
      </div>
      <div className="one-ref-path">
        <PathChart paths={trafficData.paths}/>
      </div>
    </div>
  </div>);
}

export default Traffic;
