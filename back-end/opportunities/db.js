const ObjectId = require('mongodb').ObjectId;
const cache = require('../memoryCache');
const logger = require('../logger')
const db_utils = require('../db.js');

async function get_opportunities() {
    let db_conn = await db_utils.get_db();

    return new Promise((resolve, reject) => {
        db_conn.collection("opportunities").find({}).toArray((err, result) =>{
            if(err){
                reject(err);
            }
            else {
                cache.set("opportunities", result);
                resolve(result);
            }
        });
    });
}


async function register_opportunity(new_opportunity) {
  let db_conn = await db_utils.get_db();

  if(cache.get('opportunities') === undefined){
    await get_opportunities();
  }


  return new Promise((resolve, reject) => {
    db_conn.collection("opportunities").insertOne(new_opportunity, (err, result) => {
      if(err){
        reject(err);
      }else {
        let new_opportunity_list = cache.get("opportunities");
        new_opportunity_list.push(new_opportunity);
        cache.set("opportunities",new_opportunity_list);
        logger.log("Oportunidade nova cadastrada");
        resolve(result);
      }
    });
  });
}

async function update_opportunity(opportunity) {
  let db_conn = await db_utils.get_db();

   opportunity._id = new ObjectId(opportunity._id);

  return new Promise((resolve, reject) => {
    db_conn.collection("opportunities").replaceOne({_id: opportunity._id }, opportunity,{w: "majority", upsert: false} ,(err, result) =>{
      if(err){
          reject(err);
      }else{
        logger.log(`Modificados ${result.result.nModified} elementos`);

        resolve(result);
      }
    });
  });
}

module.exports = { get_opportunities, update_opportunity, register_opportunity };
