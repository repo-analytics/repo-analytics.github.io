import React, { useEffect, useState } from "react";
import http from '../utils/http';
import ProjectCard from '../components/ProjectCard';
import './Home.css';
import Footer from '../components/Footer';
import GitHubButton from 'react-github-btn'
import CardLoader from '../components/CardLoader';

function Home ({user}) {

  const [repos, setRepos] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    http.getUserRepos('timqian')
      .then(repos => {
        setRepos(repos);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="home-main">
      <div className="home-hero">
        <div className="home-github-btn">
          <GitHubButton href="https://github.com/repo-analytics/repo-analytics.github.io" data-show-count="true" aria-label="Star repo-analytics/repo-analytics.github.io on GitHub">Star</GitHubButton>
        </div>
        <h1 className="home-slogan">
          Thorough analytics for your GitHub repos
        </h1>
        <div className="home-features">
          <div className="home-feature">
            <h4 className="home-feature-title">Better traffic data</h4>
            <p className="home-feature-description">
              Track traffic to GitHub Repos for longer than 14 days.
            </p>
          </div>
          <div className="home-feature">
            <h4 className="home-feature-title">Understand your users</h4>
            <p className="home-feature-description">
              Analyze history, locations of Star, Clone, Fork data of your GitHub Repos
            </p>
          </div>
          <div className="home-feature">
            <h4 className="home-feature-title">What do you care?</h4>
            <p className="home-feature-description">
              Suggest new features for Repo Analytics on 
              &nbsp;
              <a href="https://github.com/repo-analytics/repo-analytics.github.io/issues">GitHub</a>
            </p>
          </div>
        </div>
        <br/>
        <br/>
        {
          !user.username ?
          <a className="home-signin-btn" href="https://repo-analytics.t9t.io/auth/github">Sign in with GitHub</a>
          : ''
        }
      </div>

      <div className="home-container">
        <h2 className="home-example-title">Example repos using <strong>Repo Analytics</strong></h2>
        { isLoading ? <CardLoader/> : ''}

        <div className="home-examples">
          {
            repos.map(repo => <div className="home-box">
              <ProjectCard repo={repo.repo} username={repo.username} createdAt={repo.createdAt} views={repo.views}/>
            </div>)
          }

        </div>

        <Footer />
      </div>
    </div>
  );
}

export default Home;