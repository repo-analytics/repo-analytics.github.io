import React, { useState, useEffect } from 'react';
import chartXkcd from 'chart.xkcd';
import './VisitChart.css';

const StarHistoryChart = ({ repo, history, notAddingUp}) => {

  const [isAdding, setIsAdding] = useState(true)
  const dates = Object.keys(history);
  let counts = Object.values(history);
  if(isAdding) {
    for(let i = 1; i < counts.length; i++) {
      counts[i] = counts[i-1]+ counts[i]
    }
  }
  const data = dates.map((date, i) => ({
    x: date,
    y: counts[i],
  }));

  useEffect(() => {
    const svg = document.querySelector('.star-history-chart');
    new chartXkcd.XY(svg, {
      data: {
        datasets: [{
          label: repo,
          data,
        }],
      },
      options: {
        xTickCount: 3,
        yTickCount: 4,
        legendPosition: chartXkcd.config.positionType.upLeft,
        showLine: true,
        timeFormat: 'YYYY-MM-DD',
        dotSize: 0.3,
        dataColors: ['#28a745'],
        // unxkcdify: true
      },
    });
  });

  return <div className="chart-container">
  <h3 className="chart-container-header"> 
    Star History   
    <button onClick={() => setIsAdding(!isAdding)} style={{float:'right', backgroundColor:'white', borderRadius:'3px',border:'1px solid #ccc', color:'#555', cursor: 'pointer'}}> {isAdding ? 'Growth' : 'Total'} </button>
  </h3>

  <div className="svg-container">
    <svg className="star-history-chart"></svg>
  </div>
</div>
}

export default StarHistoryChart;
