import React, { useState } from "react";
import http from "../utils/http";
import userSignedIn from '../utils/userSignedIn';
import './AddRepo.css';
import { alert } from 'notie';


const AddRepo = () => {
  const localUser = userSignedIn.get();
  const [repoPath, setRepoPath] = useState();
  const [isLoading, setIsLoading] = useState(false);

  async function addRepo () {
    try {
      setIsLoading(true);
      await http.addRepo({ username: localUser.username, repoPath, token: localUser.token });
      window.location = `/${repoPath}`;
    } catch (err) {
      setIsLoading(false);
      alert({
        type: 'error', // optional, default = 4, enum: [1, 2, 3, 4, 5, 'success', 'warning', 'error', 'info', 'neutral']
        text: `Failed: "${err.response.data}"`,
        stay: false, // optional, default = false
        time: 3, // optional, default = 3, minimum = 1,
        position: 'top' // optional, default = 'top', enum: ['top', 'bottom']
      })
    }
  }

  return <div className="home-box">
    <div className="add-new">

      <input placeholder={`e.g. ${localUser.username}/repo-name`} className="repo-input" onChange={(e) => setRepoPath(e.target.value)}></input>
      <button className={`${isLoading ? 'isLoading' : ''} add-repo-btn`} onClick={() => addRepo()}>
        {isLoading ? 'Adding' : 'Add repo'}
      </button>
      <div className="add-new-footer">
        <a href="https://github.com/repo-analytics/repo-analytics.github.io/issues/1">Pricing</a>
      </div>
    </div>

  </div>;
}

export default AddRepo;