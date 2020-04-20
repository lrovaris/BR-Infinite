const ObjectId = require('mongodb').ObjectId;
var cache = require('../memoryCache');


function get_seguradoras() {
    return new Promise((resolve, reject) => {
        global.db.collection("seguradoras").find({}).toArray((err, result) =>{
            if(err){
                reject(err);
            }
            else {
                cache.set("seguradoras", result);
                resolve(result);
            }
        });
    });
}


function register_seguradora(new_seguradora) {
    return new Promise((resolve, reject) => {
        global.db.collection("seguradoras").insertOne(new_seguradora, (err, result) => {
            if(err){
                reject(err);
            }else {
                let new_seguradora_list = cache.get("seguradoras");
                new_seguradora_list.push(new_seguradora);
                cache.set("seguradoras",new_seguradora_list);
                console.log("Seguradora nova cadastrada");
                resolve(result);
            }
        });
    });
}

function update_seguradora(seguradora) {
   seguradora._id = new ObjectId(seguradora._id);

  return new Promise((resolve, reject) => {
    global.db.collection("seguradoras").replaceOne({_id: seguradora._id }, seguradora,{w: "majority", upsert: false} ,(err, result) =>{
      if(err){
          reject(err);
      }else{
        console.log(`Modificados ${result.result.nModified} elementos`);

        resolve(result);
      }
    });
  });
}

module.exports = { get_seguradoras, update_seguradora, register_seguradora };
