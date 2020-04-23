const ObjectId = require('mongodb').ObjectId;
var cache = require('../memoryCache');
var logger = require('../logger');

const db_utils = require('../db.js');

async function get_users() {
  let db_conn = await db_utils.get_db();

    return new Promise((resolve, reject) => {
        db_conn.collection("users").find({}).toArray((err, result) =>{
            if(err){
                reject(err);
            }
            else {
                cache.set("users", result);
                resolve(result);
            }
        });
    });
}


async function register_user(new_user) {
  let db_conn = await db_utils.get_db();

  return new Promise((resolve, reject) => {
      db_conn.collection("users").insertOne(new_user, (err, result) => {
          if(err){
              reject(err);
          }else {
              let new_user_list = cache.get("users");
              new_user_list.push(new_user);
              cache.set("users",new_user_list);
              logger.log("Usuário novo criado");
              resolve(result);
          }
      });
  });
}

async function update_user(user) {
  user._id = new ObjectId(user._id);

  let db_conn = await db_utils.get_db();

  return new Promise((resolve, reject) => {
    db_conn.collection("users").replaceOne({_id: user._id }, user,{w: "majority", upsert: false} ,(err, result) =>{
      if(err){
          reject(err);
      }else{
        logger.log(`Modificados ${result.result.nModified} elementos`);

        resolve(result);
      }
    });
  });
}

module.exports = { get_users, update_user, register_user };
