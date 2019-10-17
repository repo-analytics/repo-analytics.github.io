const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const jwt = require('jwt-simple');
const UserDao = require('./db/User');
const RepoDao = require('./db/Repo');
const TrafficDao = require('./db/Traffic');
const StarDao = require('./db/Star');
const config = require('./secret.json');
const trafficDateRangeToDateArr = require('./utils/trafficDateRangeToDateArr');
const getUniqueListBy = require('./utils/getUniqueListBy');
const getTrafficOfRepoAndSave = require('./utils/getTrafficOfRepoAndSave');
const getStars = require('./utils/getStars');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

passport.use(
  new GitHubStrategy(
    {
      clientID: config.github.clientID,
      clientSecret: config.github.clientSecret,
      scope: 'user:email,repo',
      callbackURL: 'https://repo-analytics.t9t.io/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, cb) => {
      /**
       * {
       *   id: '5512552',
       *   displayName: 'Tim Qian',
       *   username: 'timqian',
       *   profileUrl: 'https://github.com/timqian',
       *   emails: [
       *     { value: 'timqian92@gmail.com', primary: false, verified: true },
       *     { value: 'timqian92@qq.com', primary: true, verified: false },
       *     { value: 'timqian@shu.edu.cn', primary: false, verified: true }
       *   ],
       *   photos: [{ value: 'https://avatars3.githubusercontent.com/u/5512552?v=4' }],
       * }
       */
      const {
        id, username, displayName, emails, photos,
      } = profile;
      // FIXME: add updatedAt to record user relogin
      // const user = await UserDao.get({ username });

      // console.log(emails)
      const userToSave = {
        username,

        accessToken,
        email: emails.filter(email => email.primary === true)[0].value,
        photo: photos[0].value,
      };

      if (displayName) userToSave.displayName = displayName;

      // if (!user) {
        await UserDao.put(userToSave);
      // }
      profile.accessToken = accessToken
      cb(null, profile);
    },
  ),
);

app.get(
  '/auth/github',
  passport.authenticate('github'),
);

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login', session: false }),
  async (req, res) => {
    const {
      id, username, displayName, emails, photos,
    } = req.user;

    const token = jwt.encode({ username }, config.jwtSecret);
    res.redirect(`https://repo-analytics.github.io/${username}?username=${username}&photo=${photos[0].value}&token=${token}`);
  },
);

/**
 * {
 *   repos: [{
 *     username: 'timqian',
 *     repo: 'timqian/chart.xkcd',
 *     createdAt: '',
 *     views: [{"timestamp":"2019-09-29T00:00:00Z","count":11,"uniques":8}],
 *   }]
 * }
 */
app.get('/user/:username', async (req, res) => {
  const username = req.params.username;
  const repos = await RepoDao.getAllForUser({ username });
  const promiseArr = repos.map(repo => {
    const repoPath = repo.repo.S;
    // FIXME: getting unnecessary data - add another method
    return TrafficDao.getLatest({ repo: repoPath });
  });

  const traffics = await Promise.all(promiseArr);
  const returnRepos = repos.map((repo, i) => {

    const obj = {
      username: repo.username.S,
      repo: repo.repo.S,
      createdAt: repo.createdAt.S,
      views: JSON.parse(traffics[i].views.S),
    }

    return obj;
  });

  res.json({
    repos: returnRepos,
  })
});

/**
 * @returns - grouped: vistit and clone data; 14 days: referrer and paths data
 * {
 *   views: [{
 *     timestamp: '2019-03-12',
 *     count: 500,
 *     unique: 300.
 *   }],
 *   clones: [{
 *     timestamp: '2019-03-12',
 *     count: 500,
 *     unique: 300.
 *   }],
 * }
 */
app.get('/repo/:org/:repo', async (req, res) => {
  const org = req.params.org;
  const repo = req.params.repo;
  const repoPath = `${org}/${repo}`;

  const latestTrafficData = await TrafficDao.getLatest({ repo: repoPath });
  const trafficObj = {
    date: latestTrafficData.date.S, // date when latest traffic data created
    repoCreatedAt: latestTrafficData.repoCreatedAt.S, // when do we start to collect data
    views: JSON.parse(latestTrafficData.views.S), // all data
    clones: JSON.parse(latestTrafficData.clones.S), // all data
    referrers: JSON.parse(latestTrafficData.referrers.S), // last 14 days
    paths: JSON.parse(latestTrafficData.paths.S), // last 14 days
  }

  // 4. combine views and clones data - how, choose larger count if timestamp is the same
  // assuming traffic data exists for everyday
  const dateArr = trafficDateRangeToDateArr(trafficObj.repoCreatedAt.slice(0,10), trafficObj.date);

  // No need to get more clone and view data
  if (!dateArr) {
    res.json({
      traffic: trafficObj,
    });
    return;
  }

  const batchRes = await TrafficDao.batchGetViewAndClones({ repo: repoPath, dateArr });

  for (const traffic of batchRes) {
    const clones = JSON.parse(traffic.clones.S);
    const views = JSON.parse(traffic.views.S);
    trafficObj.clones.unshift(...clones);
    trafficObj.views.unshift(...views);
  }

  trafficObj.clones = getUniqueListBy(trafficObj.clones, 'timestamp');
  trafficObj.views = getUniqueListBy(trafficObj.views, 'timestamp');

  res.json({
    traffic: trafficObj,
  });

});

app.get('/repo/:org/:repo/stars', async (req, res) => {
  const org = req.params.org;
  const repo = req.params.repo;
  const repoPath = `${org}/${repo}`; 
  const starRes = await StarDao.get({repo: repoPath});

  const starObj = {
    repo: starRes.repo.S,
    totalCount: starRes.totalCount.S,
    history: JSON.parse(starRes.history.S),
    locations: JSON.parse(starRes.locations.S),
    updatedAt: starRes.updatedAt.S,
  }
  res.json(starObj);
});

app.post('/repo/add', async (req, res) => {
  const { username, repoPath, token } = req.body;
  // 1. test if the user is allowed to add repo to username
  let decoded;
  try {
    decoded = jwt.decode(token, config.jwtSecret);
  } catch (error) {
    res.status(400).json('bad token');
    return;
  }
  if (decoded.username !== username) {
    res.status(400).json('token user mismatch');
    return;
  }

  // 2. test if user already have 3 repos TODO: remove after finishing billing part

  const userCurrentRepos = await RepoDao.getAllForUser({username});
  if (userCurrentRepos.length >= 3) {
    res.status(400).json('Currenly we only support importing 3 repos, see pricing page for more info');
    return;
  }

  // 3. test if user being able to get traffic of the repo
  const user = await UserDao.get({ username });
  const githubToken = user.accessToken.S;
  try {
    await getTrafficOfRepoAndSave({ repoPath, token: githubToken });
    // create repo
    await RepoDao.put({
      username,
      repo: repoPath,
    });

    // add star analytics(async)
    getStars(username, repoPath)
      .then(res => {
        StarDao.put({
          repo: repoPath,
          ...res
        });
      });

    res.json('ok');
  } catch (e) {
    console.log(e)
    res.status(400).json('github token permission insufficient');
  }
})

app.get('/', (req, res) => {
  res.json('hey')
});

const { PORT = 8080 } = process.env;
app.listen(PORT);
console.log(`server running on http://localhost:${PORT}`);
