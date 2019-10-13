import React, { useEffect, useState } from "react";
import http from '../utils/http';
import ProjectCard from '../components/ProjectCard';
import './User.css';
import userSignedIn from '../utils/userSignedIn';
import CardLoader from '../components/CardLoader';
import AddRepo from '../components/AddRepo';
import Footer from '../components/Footer';

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
  }, []);

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
            <ProjectCard repo={repo.repo} username={repo.username} createdAt={repo.createdAt} views={repo.views}/>
          </div>)
        }

        {
          userLocal.username === username ?
            <AddRepo /> : ''
        }
      </div>

      <Footer />
    </div>
  );
}

export default User;