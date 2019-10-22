const { GraphQLClient } = require('graphql-request');
const guess = require('./guessCountryFromAddress');

const UserDao = require('../db/User');

/**
 * Get all stargazers of a repo and store to db
 * 
 * {
 *   totalCount: '',
 *   updatedAt: '',
 *   history: {
 *     '2018-04-12': 10,
 *   },
 *   locations: {
 *     china: 3,
 *   }
 * }
 */

const getStars = async (username, repoPath) => {
  const res = {
    totalCount: 0,
    updatedAt: '',
    history: {},
    locations: {},
  };

  const user = await UserDao.get({username});
  const token = user.accessToken.S;
  const [repoOwner, repoName] = repoPath.split('/')

  const endpoint = 'https://api.github.com/graphql';

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      Authorization: `bearer ${token}`,
    },
  })

  const query = `
    {
      repository(owner: "${repoOwner}", name: "${repoName}") {
        stargazers(first: 100) {
          nodes {
            location
          }
          edges {
            starredAt
          }
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }  
  `;

  let data = await graphQLClient.request(query);
  res.totalCount = data.repository.stargazers.totalCount;

  const updateRes = (stargazers) => {
    const dateArr = stargazers.edges;
    const userArr = stargazers.nodes;

    dateArr.forEach(element => {
      const starDate = element.starredAt.slice(0, 10);
      if(res.history[starDate]) {
        res.history[starDate] = res.history[starDate] + 1;
      } else {
        res.history[starDate] = 1;
      }
    });

    userArr.forEach(el => {
      if (el.location) {
        const location = guess(el.location);
        if (location) res.locations[location]
          ? res.locations[location] = res.locations[location] + 1 
          : res.locations[location] = 1;
      }
    })
  }

  updateRes(data.repository.stargazers);

  let pageCount = 0
  while(data.repository.stargazers.pageInfo.hasNextPage) {
    console.log('page count', pageCount + 1);
    const query2 = `
    {
      repository(owner: "${repoOwner}", name: "${repoName}") {
        stargazers(first: 100, after: "${data.repository.stargazers.pageInfo.endCursor}") {
          nodes {
            location
          }
          edges {
            starredAt
          }
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }   
    `;
    data = await graphQLClient.request(query2);
    updateRes(data.repository.stargazers); 
    pageCount++;
  }

  res.updatedAt = new Date().toISOString();
  // console.log(res)
  return res;
}


module.exports = getStars;
// getStars('timqian', 't9tio/cloudquery')
