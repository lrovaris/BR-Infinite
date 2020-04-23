const ObjectId = require('mongodb').ObjectId;
const cache = require('../memoryCache');
const logger = require('../logger');

const db_utils = require('../db.js');


async function get_seguradoras() {
  let db_conn = await db_utils.get_db();

    return new Promise((resolve, reject) => {
        db_conn.collection("seguradoras").find({}).toArray((err, result) =>{
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


async function register_seguradora(new_seguradora) {
  let db_conn = await db_utils.get_db();

    return new Promise((resolve, reject) => {
        db_conn.collection("seguradoras").insertOne(new_seguradora, (err, result) => {
            if(err){
                reject(err);
            }else {
                let new_seguradora_list = cache.get("seguradoras");
                new_seguradora_list.push(new_seguradora);
                cache.set("seguradoras",new_seguradora_list);
                logger.log("Seguradora nova cadastrada");
                resolve(result);
            }
        });
    });
}

async function update_seguradora(seguradora) {
  let db_conn = await db_utils.get_db();

  seguradora._id = new ObjectId(seguradora._id);

  return new Promise((resolve, reject) => {
    db_conn.collection("seguradoras").replaceOne({_id: seguradora._id }, seguradora,{w: "majority", upsert: false} ,(err, result) =>{
      if(err){
          reject(err);
      }else{
        logger.log(`Modificados ${result.result.nModified} elementos`);

        resolve(result);
      }
    });
  });
}

module.exports = { get_seguradoras, update_seguradora, register_seguradora };
