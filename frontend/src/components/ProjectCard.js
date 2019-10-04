import React from 'react';
import './ProjectCard.css';
import Trend from 'react-trend';


const ProjectCard = ({username, projectName, visitData}) => (
<div className="card-container">
  <div className="card-description">
    <a href={username}>{username}</a>
      <span className="path-divider">/</span>
    <strong>
      <a href={`${username}/${projectName}`}>{projectName}</a>
    </strong>
  </div>

  <div class="project-trend">
    <Trend
      smooth
      autoDraw
      autoDrawDuration={2000}
      autoDrawEasing="ease-out"
      data={[0,2,5,9,5,10,3,5,0,0,1,8,2,9,0]}
      gradient={['#d7ecad', '#9cd696', '#2ebc4f']}
      radius={0}
      strokeWidth={1.7}
      strokeLinecap={'square'}
    />
  </div>
</div>)

export default ProjectCard;