const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const url = "mongodb://luizfelipe:123456qwe@ds141410.mlab.com:41410/brinfinite";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true  });
const assert = require('assert');
const cache = require('./memoryCache');


// DATA BASE INIT
function init_db(){
    return new Promise((resolve, reject) => {
        client.connect(err => {
            if(err){
                reject(err);
            }
            else {
                console.log("Conectado");
                global.db = client.db("brinfinite");
                resolve(global.db);
            }
        });
    });
}
//END DATA BASE INIT

// GET USERS

function get_users() {
    return new Promise((resolve, reject) => {
        global.db.collection("users").find({}).toArray((err, result) =>{
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

function register_user(new_user) {
    return new Promise((resolve, reject) => {
        global.db.collection("users").insertOne(new_user, (err, result) => {
            if(err){
                reject(err);
            }else {
                let new_user_list = [cache.get("users"), new_user];
                cache.set("users",new_user_list);
                console.log("Usuário novo criado");
                resolve(result);
            }
        });
    });
}

function update_user(user) {
   user._id = new ObjectId(user._id);

  return new Promise((resolve, reject) => {
    global.db.collection("users").replaceOne({_id: user._id }, user,{w: "majority", upsert: false} ,(err, result) =>{
      if(err){
          reject(err);
      }else{
        console.log(`Modificados ${result.result.nModified} elementos`);

        resolve(result);
      }
    });
  });
}

module.exports = {
    init_db,
    get_users,
    register_user,
    update_user
};
