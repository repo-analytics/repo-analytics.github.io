/**
 * user: {
 *   username: 'timqian',
 *   token: '',
 *   photo: '',
 * }
 */

function set({ username, token, photo }) {
  window.localStorage.setItem('user', JSON.stringify({
    username, token, photo
  }))
}

function get() {
  let user = {};
  const userRaw = window.localStorage.getItem('user');
  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch (err) {}
  }
  return user;
}

function remove() {
  window.localStorage.removeItem('user');
}

module.exports = {
  set,
  get,
  remove,
};