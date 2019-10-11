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
          <ProjectCard repo="repo-analytics/repo-analytics.github.io" username="timqian" createdAt="2019-10-09-"/>
        </div>
        <div className="home-box">
          <ProjectCard repo="timqian/chart.xkcd" username="timqian" createdAt="2019-10-09-"/>
        </div>
        <div className="home-box">
          <ProjectCard repo="t9tio/open-source-jobs" username="timqian" createdAt="2019-10-09-"/>
        </div>
        <div className="home-box">
          <ProjectCard repo="timqian/star-history" username="timqian" createdAt="2019-10-09-"/>
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