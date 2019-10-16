import React from 'react';

const Referrer = ({referrers}) => {

  console.log('referrers', referrers)
  return (
    <div className="chart-container">
      <h3 className="chart-container-header"> Referring sites </h3>
      <table>
        <thead>
          <tr>
            <th>Site</th>
            <th>Views</th>
            <th>Unique visitors</th>
          </tr>
        </thead>
        <tbody>
          {referrers.map(referrer => <tr>
            <td>{referrer.referrer}</td>
            <td>{referrer.count}</td>
            <td>{referrer.uniques}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
)};

export default Referrer;