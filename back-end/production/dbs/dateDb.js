const ObjectId = require('mongodb').ObjectId;
const cache = require('../../memoryCache');
const logger = require('../../logger')
const db_utils = require('../../db.js');

async function get_production_dates() {
    let db_conn = await db_utils.get_db();

    let db_dates = await db_conn.collection("production_dates").find({}).toArray();

    cache.set("production_dates", db_dates)

    return db_dates;
}

async function register_production_date(new_date) {
  let db_conn = await db_utils.get_db();

  let new_date_db = await db_conn.collection("production_dates").insertOne(new_date)

  await get_production_dates();

  logger.log("Data nova cadastrada");

  return new_date_db.ops[0];
}

async function update_production_date(production_date) {
   let db_conn = await db_utils.get_db();

   let edited_production_date = await db_conn.collection("production_dates").replaceOne({_id: new ObjectId(production_date._id) }, production_date,{w: "majority", upsert: false});

   logger.log(`Modificados ${edited_production_date.result.nModified} elementos`);

   await get_production_dates();

   return edited_production_date.ops[0];
}


module.exports = { get_production_dates, register_production_date, update_production_date };
