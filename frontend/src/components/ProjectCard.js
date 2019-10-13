import React, { useRef, useEffect } from 'react';
import chartXkcd from 'chart.xkcd';
import './ProjectCard.css';


const ProjectCard = ({repo, createdAt, username, views}) => {

  const ref = useRef();
  const totalViewsData = views.map(view => ({
    x: view.timestamp,
    y: view.count,
  }));
  const uniqueViewsData = views.map(view => ({
    x: view.timestamp,
    y: view.uniques,
  }));
  
  useEffect(() => {
    if (ref.current) {
      new chartXkcd.XY(ref.current, {
        // title: 'Visitors',
        data: {
          datasets: [{
            label: 'Views',
            data: totalViewsData,
          }, {
            label: 'Unique Visitors',
            data: uniqueViewsData,
          }],
        },
        options: {
          xTickCount: 3,
          yTickCount: 4,
          legendPosition: chartXkcd.config.positionType.upLeft,
          showLine: true,
          timeFormat: 'MM/DD/YYYY',
          dotSize: 0.5,
          dataColors: ['#28a745', '#005cc5'],
          // unxkcdify: true
        },
      });
    }
  }, []);

  return   <div className="card-container">
  <div className="card-description">
    <a href={`/${repo}`}>{repo}</a>
  </div>

  <div className="project-trend">
    <svg ref={ref}></svg>
  </div>

  <div className="card-footer">
    Recoding analytics since {createdAt.slice(0, 10)}
  </div>
</div>
};

export default ProjectCard;