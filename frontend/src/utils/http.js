import axios from 'axios';

const userRaw = window.localStorage.getItem('user');

let token;
if (userRaw) {
  const user = JSON.parse(userRaw);
  token = user.token;
}

const http = axios.create({
  // baseURL: 'https://repo-analytics.t9t.io/',
  baseURL: 'http://localhost:8080/',
  timeout: 20000,
  headers: {
    token,
  },
});
 
const getUserRepos = async (username) => {
  const res = await http.get(`/user/${username}`);
  return res.data.repos;
}

/**
 * 
 * @param {String} repoPath 
 * @param {String} startDate 
 * @param {String} endDate 
 */
const getRepoTraffic = async ({repoPath}) => {
  const res = await http.get(`/repo/${repoPath}`);
  return res.data.traffic[0];
}

export default {
  getUserRepos,
  getRepoTraffic,
};