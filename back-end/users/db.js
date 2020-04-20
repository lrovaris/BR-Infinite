const ObjectId = require('mongodb').ObjectId;
var cache = require('../memoryCache');


function get_users() {
    return new Promise((resolve, reject) => {
        global.db.collection("users").find({}).toArray((err, result) =>{
            if(err){
                reject(err);
            }
            else {
                //console.log(result);
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

module.exports = { get_users, update_user, register_user };
