import React from "react";
const Nav = ({repoPath, selectedTab}) => {
  return (
    <div className="repo-header">
      <div className="repo-container">
        <h1 className="repo-title">
          <a className="user-link" href={`/${repoPath}`}>
            {repoPath}
          </a>
          <a className="user-github-link" href={`https://github.com/${repoPath}`}>
            <i className="ri-github-line"></i>
          </a>   
        </h1>
        <nav className="repo-nav">
          <a href className={selectedTab === 0 ? 'selected' : ''} href={`/${repoPath}/traffic`}>Traffic</a>
          <a href className={selectedTab === 1 ? 'selected' : ''} href={`/${repoPath}/stars`}>Stars</a>
          {/* <a href className={selectedTab === 2 ? 'selected' : ''} href={`/${repoPath}/settings`}>Settings</a> */}
        </nav>
      </div>
    </div>
  );
};

export default Nav;