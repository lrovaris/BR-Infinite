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

async function get_user_by_login(login){
  let all_users = await get_users();

  let this_user = all_users.find(user_obj => user_obj.login === login.toLowerCase());

  return this_user;
}

async function get_user_by_id(user_id){
  let all_users = await get_users();

  let this_user = all_users.find(user_obj => user_obj._id.toString() === user_id.toString());

  return this_user;
}

module.exports = { get_users, get_user_by_login, get_user_by_id };
