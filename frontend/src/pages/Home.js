import React from "react";
import ProjectCard from '../components/ProjectCard';
import './Home.css'

function Home ({user}) {
 return (
  <div>
    <div className="home-hero">
      <h1 className="home-slogan">Thorough analytics for your GitHub repos</h1>
      {
        !user.username ?
        <a className="home-signin-btn" href="https://repo-analytics.t9t.io/auth/github">Sign in with GitHub</a>
        : ''
      }

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
      </div>

    </div>

    <div className="home-container">
      <h2 className="home-example-title">Example repos using <strong>Repo Analytics</strong></h2>
      <div className="home-examples">
        <div className="home-box">
          <ProjectCard username="repo-analytics" projectName="repo-analytics.github.io" />
        </div>
        <div className="home-box">
          <ProjectCard username="timqian" projectName="chart.xkcd" />
        </div>
        <div className="home-box">
          <ProjectCard username="t9tio" projectName="open-source-jobs" />
        </div>
        <div className="home-box">
          <ProjectCard username="timqian" projectName="star-history" />
        </div>
      </div>
    </div>

    <hr className="home-hr"/>
    <div className="home-container">
      <h2 className="home-example-title">What data do we analyze</h2>
    </div>
  </div>
  );
}

export default Home;