import React, { useEffect } from 'react';
import chartXkcd from 'chart.xkcd';
import './VisitChart.css';

const VisitChart = ({ views }) => {
  const totalViewsData = views.map(view => ({
    x: view.timestamp,
    y: view.count,
  }));
  const uniqueViewsData = views.map(view => ({
    x: view.timestamp,
    y: view.uniques,
  }));
  useEffect(() => {
    const svg = document.querySelector('.visit-chart');
    new chartXkcd.XY(svg, {
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
  }, []);

  return <div className="chart-container">
  <h3 className="chart-container-header"> Visitors </h3>
  <div className="svg-container">
    <svg className="visit-chart"></svg>
  </div>
</div>
}

export default VisitChart;
