const ObjectId = require('mongodb').ObjectId;
const cache = require('../memoryCache');
const logger = require('../logger');

const db_utils = require('../db.js');


async function get_seguradoras() {
  let db_conn = await db_utils.get_db();

  const all_seguradoras = await db_conn.collection("seguradoras").find({}).toArray();

  cache.set("seguradoras", all_seguradoras);

  return all_seguradoras;
}

async function register_seguradora(new_seguradora) {
  let db_conn = await db_utils.get_db();

  let new_seg = await db_conn.collection("seguradoras").insertOne(new_seguradora);

  await get_seguradoras();

  logger.log("Seguradora nova cadastrada");

  return new_seg;
}

async function update_seguradora(seguradora) {
  let db_conn = await db_utils.get_db();

  let updated_seg = await db_conn.collection("seguradoras").replaceOne({_id: new ObjectId(seguradora._id) }, seguradora,{w: "majority", upsert: false});

  logger.log(`Modificados ${updated_seg.result.nModified} elementos`);

  await get_seguradoras();

  return updated_seg;
}

module.exports = { get_seguradoras, update_seguradora, register_seguradora };
