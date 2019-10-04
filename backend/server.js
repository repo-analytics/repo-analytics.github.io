const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const UserDao = require('./db/User');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());

passport.use(
  new GitHubStrategy(
    {
      clientID: '4bb4db66720ab9d2513f',
      clientSecret: '4e9ef24986e479a69bd3652c54010a0de2d88b70',
      scope: 'user:email,repo',
      callbackURL: 'https://repo-analytics.t9t.io/auth/github/callback',
    },
    (accessToken, refreshToken, profile, cb) => {
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
    } = req.user;
    const user = await UserDao.get({ githubId: id });
    const userToSave = {
      githubId: id,
      username,
      name: displayName,
      email: emails.filter(email => email.primary === true)[0].value,
      photo: photos[0].value,
    };
    if (!user) {
      await UserDao.put(userToSave);
    }
    res.redirect(`https://repo-analytics.github.io`);
  },
);

const { PORT = 8080 } = process.env;
app.listen(PORT);
console.log(`server running on http://localhost:${PORT}`);
