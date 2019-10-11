import React, { useEffect, useState } from "react";
import http from '../utils/http';
import ProjectCard from '../components/ProjectCard';
import './User.css';
import userSignedIn from '../utils/userSignedIn';
import CardLoader from '../components/CardLoader';

function User ({ match }) {
  const username = match.params.username;
  const userLocal = userSignedIn.get();
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    setIsLoading(true);
    http.getUserRepos(username)
      .then(repos => {
        setRepos(repos);
        setIsLoading(false);
      });
  }, [])

  return (
    <div className="home-container">
      <h1 className="user-title">
        Repos of&nbsp;
        <a className="user-github-link" href={`https://github.com/${username}`}>
          {username}
        </a>
        <a className="user-github-link" href={`https://github.com/${username}`}>
          <i className="ri-github-line"></i>
        </a>
      </h1>
      { isLoading ? <CardLoader/> : ''}
      <div className="home-examples">
        {
          repos.map(repo => <div className="home-box">
            <ProjectCard repo={repo.repo.S} username={repo.username.S} createdAt={repo.createdAt.S}/>
          </div>)
        }

        {
          userLocal.username === username ?
          <div className="home-box">
            <div className="add-new">
              <input placeholder={`e.g. ${username}/repo-name`} className="repo-input"></input>
              <button  className="repo-add-btn">Add repo</button>
            </div>
          </div> : ''
        }
      </div>
    </div>
  );
}

export default User;