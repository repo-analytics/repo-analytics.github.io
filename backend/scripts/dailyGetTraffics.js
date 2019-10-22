const axios = require('axios');
const UserDao = require('../db/User');
const RepoDao = require('../db/Repo');
const TrafficDao = require('../db/Traffic');

/**
 * This script get daily traffic data for all repos.
 * Run once per day
 * 
 * Process
 *   1. get all users
 *   1. get all repos
 *   1. for every repo: get its traffic by using user's token
 */
async function run() {
  const dateStr = new Date().toISOString().slice(0, 10);

  // ---- 1. get all users ----

  // [{ username: { S: 'timqian' }, accessToken: { S: 'token' }}]
  const users = await UserDao.scan();
  // { timqian: 'token' }
  const userMap = users.reduce((pre, cur) => {
    pre[cur.username.S] = cur.accessToken.S;
    return pre;
  }, {});

  // ---- 2. get all repos ----

  // [{ username: { S: 'timqian' }, repo: { S: 'timqian/chart.xkcd' }}]
  const repos = await RepoDao.scan();

  // [{ username: 'timqian', repo: 'timqian/chart.xkcd', accessToken: 'token' }]
  const repoArr = repos.map(repo => {
    const username = repo.username.S;
    const createdAt = repo.createdAt.S;
    const accessToken = userMap[username];
    return {
      username,
      repo: repo.repo.S,
      accessToken,
      createdAt,
    }
  });

  // ---- 3. query and store to db ----
  for(let i = 0; i < repoArr.length; i++) {
    const repo = repoArr[i];
    try {
      // if (!['airyland/vux', 'ZhuPeng/mp-transform-public', 'amorist/platelet', 'timqian/star-history'].includes(repo.repo)) continue;
      console.log('Fetching', repo.repo);
      const http = axios.create({
        baseURL: 'https://api.github.com/',
        timeout: 30000,
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${repo.accessToken}`,
        },
      });
      const viewsPromise = http.get(`/repos/${repo.repo}/traffic/views`);
      const clonesPromise = http.get(`/repos/${repo.repo}/traffic/clones`);
      const referrersPromise = http.get(`/repos/${repo.repo}/traffic/popular/referrers`);
      const pathsPromise = http.get(`/repos/${repo.repo}/traffic/popular/paths`);
      
      const trafficRes = await Promise.all([viewsPromise, clonesPromise, referrersPromise, pathsPromise]);
      
      await TrafficDao.put({
        repo: repo.repo,
        date: dateStr,
        views: trafficRes[0].data.views,
        clones: trafficRes[1].data.clones,
        referrers: trafficRes[2].data,
        paths: trafficRes[3].data,
        repoCreatedAt: repo.createdAt,
      });
    } catch (error) {
      if(error.response) {
        console.log(error.response.message);
      } else {
        console.log(error.message)
      }
    }

  }
}

run();