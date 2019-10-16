import React, { useEffect, useState } from "react";
import RepoLoader from "./RepoLoader";
import http from '../utils/http';
import StarHistoryChart from "./StarHistoryChart";
import StarLocationChart from "./StarLocationChart";

const Traffic = ({ repoPath }) => {
  const [starData, setstarData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    http.getRepoStars({
      repoPath,
    })
      .then(traffic => {
        setstarData(traffic);
        setIsLoading(false);
      })
      .catch(err => console.log(err));
  }, []);

  if (isLoading || !starData) {
    return <div className="repo-container">
      <RepoLoader/>
    </div>
  }

  return (<div className="repo-container">
    <div className="dates-container">
      <p>Updated at {starData.updatedAt.slice(0,10)}</p>
    </div> 

    

    <div className="repo-ref-paths-container">
      <div className="one-ref-path">
        <StarHistoryChart repo={starData.repo} history={starData.history}/>
      </div>
      <div className="one-ref-path">
        <StarLocationChart locations={starData.locations}/>
      </div>
    </div>


  </div>);
}

export default Traffic;
