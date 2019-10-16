import React from 'react';

const Paths = ({paths}) => (
  <div className="chart-container">
    <h3 className="chart-container-header"> Popular content </h3>
    <table>
      <thead>
        <tr>
          <th>Content</th>
          <th>Views</th>
          <th>Unique visitors</th>
        </tr>
      </thead>
      <tbody>
        {paths.map(path => <tr>
          <td><a href={`https://github.com/${path.path}`}>{path.path}</a></td>
          <td>{path.count}</td>
          <td>{path.uniques}</td>
        </tr>)}
      </tbody>
    </table> 
  </div>
);

export default Paths;
