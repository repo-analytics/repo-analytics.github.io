const axios = require('axios');
const TrafficDao = require('../db/Traffic');

const func = async ({ repoPath, token }) => {
  const http = axios.create({
    baseURL: 'https://api.github.com/',
    timeout: 10000,
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': `token ${token}`,
    },
  });
  const viewsPromise = http.get(`/repos/${repoPath}/traffic/views`);
  const clonesPromise = http.get(`/repos/${repoPath}/traffic/clones`);
  const referrersPromise = http.get(`/repos/${repoPath}/traffic/popular/referrers`);
  const pathsPromise = http.get(`/repos/${repoPath}/traffic/popular/paths`);

  const trafficRes = await Promise.all([viewsPromise, clonesPromise, referrersPromise, pathsPromise]);

  const dateStr = new Date().toISOString().slice(0, 10);

  await TrafficDao.put({
    repo: repoPath,
    date: dateStr,
    views: trafficRes[0].data.views,
    clones: trafficRes[1].data.clones,
    referrers: trafficRes[2].data,
    paths: trafficRes[3].data,
    repoCreatedAt: new Date().toISOString(),
  });
}

module.exports = func;

// test
// func({repoPath: 'timqian/chart.xkcd', token: ''})