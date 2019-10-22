const RepoDao = require('../db/Repo');
const getStars = require('../utils/getStars');
const StarDao = require('../db/Star');

const get = async () => {
  const repos = await RepoDao.scan();

  for (const repo of repos) {
    const repoPath = repo.repo.S;
    // if (repoPath !== 'NervJS/taro') continue;
    const repoOwner = repo.username.S;
    try {
      console.log('going to fetch', repoOwner, repoPath)
      const res = await getStars(repoOwner, repoPath);
      console.log('going to store', repoOwner, repoPath);
      await StarDao.put({
        repo: repoPath,
        ...res
      });
      console.log('success', repoOwner, repoPath);
    } catch (error) {
      if(error.response) {
        console.log(error.response.message);
      } else {
        console.log(error.message)
      }
    }
  }
}

get();
