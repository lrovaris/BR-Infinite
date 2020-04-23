const db = require('./db');
let cache = require('../memoryCache');

async function get_users() {
  let all_users = cache.get('users');

  if(all_users !== undefined){
    return all_users;
  }else {
    all_users = await db.get_users();
    return all_users;
  }
}

module.exports = { get_users };
