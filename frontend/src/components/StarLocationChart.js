import React, { useEffect } from 'react';
import chartXkcd from 'chart.xkcd';
import './VisitChart.css';

const StarLocationChart = ({ locations }) => {

  const locationsKeys = Object.keys(locations);
  const counts = Object.values(locations);
  const totalCount = counts.reduce((pre, cur) => pre + cur);
  const topLocations = locationsKeys.sort((a, b)=> locations[b] - locations[a]).slice(0, 6);
  const topCounts = counts.sort((a, b) => b - a).slice(0, 6);
  const othersCount = totalCount - topCounts.reduce((pre, cur) => pre + cur);

  useEffect(() => {
    const svg = document.querySelector('.star-location-chart');
    new chartXkcd.Pie(svg, {
      data: {
        labels: [...topLocations, 'others'],
        datasets: [{
          data: [...topCounts, othersCount],
        }],
      },
      options: {
        innerRadius: 0.5,
        // unxkcdify: true
      },
    });
  }, []);

  return <div className="chart-container">
  <h3 className="chart-container-header"> 
    Star Locations
  </h3>

  <p className="location-description">{totalCount} valid locations detected</p>
  <div className="svg-container">
    <svg className="star-location-chart"></svg>
  </div>
</div>
}

export default StarLocationChart;
