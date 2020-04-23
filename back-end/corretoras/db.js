const ObjectId = require('mongodb').ObjectId;
const cache = require('../memoryCache');
const logger = require('../logger');

const db_utils = require('../db.js');

async function get_corretoras() {
  db_conn = await db_utils.get_db();

  return new Promise((resolve, reject) => {


    db_conn.collection("corretoras").find({}).toArray((err, result) =>{
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


async function register_corretora(new_corretora) {
  db_conn = await db_utils.get_db();

  if(cache.get('corretoras') === undefined){
    await get_corretoras();
  }

  return new Promise((resolve, reject) => {
    db_conn.collection("corretoras").insertOne(new_corretora, async(err, result) => {
      if(err){
        reject(err);
      }else {

        let new_corretora_list = cache.get('corretoras');
        new_corretora_list.push(new_corretora);
        cache.set("corretoras",new_corretora_list);
        logger.log("Corretora nova cadastrada");
        resolve(result);
      }
    });
  });
}

async function update_corretora(corretora) {
  db_conn = await db_utils.get_db();

   corretora._id = new ObjectId(corretora._id);

  return new Promise((resolve, reject) => {
    db_conn.collection("corretoras").replaceOne({_id: corretora._id }, corretora,{w: "majority", upsert: false} ,(err, result) =>{
      if(err){
          reject(err);
      }else{
        logger.log(`Modificados ${result.result.nModified} elementos`);

        resolve(result);
      }
    });
  });
}

module.exports = { get_corretoras, update_corretora, register_corretora };
