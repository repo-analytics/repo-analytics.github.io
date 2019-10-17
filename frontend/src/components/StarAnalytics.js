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
      <h2>Here we analyse history and location statics of your repo. </h2>
      <p>You might need to wait for a minute or two and refresh the page if your repo have too many stars and it is the first time you open this page</p>
      <RepoLoader/>
    </div>
  }

  return (<div className="repo-container">
    <div className="dates-container">
      <p>Updated at {starData.updatedAt.slice(0,10)}</p>
    </div> 

    <div className="repo-ref-paths-container">
      <div className="one-ref-path">
        {
          Object.keys(starData.history).length !== 0 
            ? <StarHistoryChart repo={starData.repo} history={starData.history}/>
            : ''
        }
      </div>
      <div className="one-ref-path">
      {
          Object.keys(starData.locations).length !== 0 
            ? <StarLocationChart locations={starData.locations}/>
            : ''
        }

      </div>
    </div>


  </div>);
}

export default Traffic;
