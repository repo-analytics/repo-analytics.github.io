import React, { useEffect } from 'react';
import chartXkcd from 'chart.xkcd';

const VisitChart = ({ clones }) => {

  const totalViewsData = clones.map(clone => ({
    x: clone.timestamp,
    y: clone.count,
  }));
  const uniqueViewsData = clones.map(clone => ({
    x: clone.timestamp,
    y: clone.uniques,
  }));
  useEffect(() => {
    const svg = document.querySelector('.clone-chart');
    new chartXkcd.XY(svg, {
      // title: 'Git clones',
      data: {
        datasets: [{
          label: 'Clones',
          data: totalViewsData,
        }, {
          label: 'Unique Clones',
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
        // unxkcdify: true // TODO: configuable
      },
    });
  }, []);

  return <div className="chart-container">
    <h3 className="chart-container-header"> Git clones </h3>
    <div className="svg-container">
      <svg className="clone-chart"></svg>
    </div>
  </div>
}

export default VisitChart;
