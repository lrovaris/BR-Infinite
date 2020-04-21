const ObjectId = require('mongodb').ObjectId;
var cache = require('../memoryCache');


function get_corretoras() {
    return new Promise((resolve, reject) => {
        global.db.collection("corretoras").find({}).toArray((err, result) =>{
            if(err){
                reject(err);
            }
            else {
                cache.set("corretoras", result);
                resolve(result);
            }
        });
    });
}


function register_corretora(new_corretora) {
    return new Promise((resolve, reject) => {
        global.db.collection("corretoras").insertOne(new_corretora, (err, result) => {
            if(err){
                reject(err);
            }else {
                let new_corretora_list = cache.get("corretoras");
                new_corretora_list.push(new_corretora);
                cache.set("corretoras",new_corretora_list);
                console.log("Corretora nova cadastrada");
                resolve(result);
            }
        });
    });
}

function update_corretora(corretora) {
   corretora._id = new ObjectId(corretora._id);

  return new Promise((resolve, reject) => {
    global.db.collection("corretoras").replaceOne({_id: corretora._id }, corretora,{w: "majority", upsert: false} ,(err, result) =>{
      if(err){
          reject(err);
      }else{
        console.log(`Modificados ${result.result.nModified} elementos`);

        resolve(result);
      }
    });
  });
}

module.exports = { get_corretoras, update_corretora, register_corretora };
