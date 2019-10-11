const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const jwt = require('jwt-simple');
const UserDao = require('./db/User');
const RepoDao = require('./db/Repo');
const TrafficDao = require('./db/Traffic');
const config = require('./secret.json');

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
      const user = await UserDao.get({ username });
      const userToSave = {
        username,
        displayName,
        accessToken,
        email: emails.filter(email => email.primary === true)[0].value,
        photo: photos[0].value,
      };
      if (!user) {
        await UserDao.put(userToSave);
      }
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

app.get('/user/:username', async (req, res) => {
  const username = req.params.username;
  const repos = await RepoDao.getAllForUser({ username });
  res.json({
    repos,
  })
});

app.get('/repo/:org/:repo', async (req, res) => {
  const org = req.params.org;
  const repo = req.params.repo;
  const repoPath = `${org}/${repo}`;
  const ISOToday = new Date().toISOString().slice(0, 10);
  const trafficTodayArr = await TrafficDao.batchGet({ repo: repoPath, dateArr: [ISOToday] });
  const trafficToday = trafficToday[0];
  if (trafficToday)

  res.json({
    traffic: trafficToday,
  })
});

app.post('/repo/add', async (req, res) => {

})

app.get('/', (req, res) => {
  res.json('hey')
});

const { PORT = 8080 } = process.env;
app.listen(PORT);
console.log(`server running on http://localhost:${PORT}`);
