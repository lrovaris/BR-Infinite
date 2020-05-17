const ObjectId = require('mongodb').ObjectId;
const cache = require('../memoryCache');
const logger = require('../logger');

const db_utils = require('../db.js');

async function get_corretoras() {
  db_conn = await db_utils.get_db();

  let all_corr = await db_conn.collection("corretoras").find({}).toArray();

  cache.set("corretoras", all_corr);

  return all_corr;
}


async function register_corretora(new_corretora) {
  db_conn = await db_utils.get_db();

  let new_corr = await db_conn.collection("corretoras").insertOne(new_corretora);

  await get_corretoras();

  logger.log("Corretora nova cadastrada");

  return new_corr.ops[0];
}

async function update_corretora(corretora) {
  db_conn = await db_utils.get_db();

  let updated_corr = await db_conn.collection("corretoras").replaceOne({_id: new ObjectId(corretora._id) }, corretora,{w: "majority", upsert: false})

  logger.log(`Modificados ${updated_corr.result.nModified} elementos`);

  await get_corretoras();

  return updated_corr.ops[0];
}

module.exports = { get_corretoras, update_corretora, register_corretora };
