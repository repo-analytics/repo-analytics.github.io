import React from 'react';
import './RepoSetting.css';

const Setting = () => (
  <div className="repo-container">
    <div className="traffic-switch">
      <label className="switch">
        <input type="checkbox"/>
        <span className="slider round"></span>
      </label>
      &nbsp; Make traffic data private
    </div>
  </div>
)

export default Setting;
