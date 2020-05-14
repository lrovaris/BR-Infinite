const ObjectId = require('mongodb').ObjectId;
const cache = require('../memoryCache');
const logger = require('../logger')
const db_utils = require('../db.js');

async function get_opportunities() {
    let db_conn = await db_utils.get_db();

    let all_opps = await db_conn.collection("opportunities").find({}).toArray();

    cache.set("opportunities", all_opps)

    return all_opps;
}


async function register_opportunity(new_opportunity) {
  let db_conn = await db_utils.get_db();

  let new_opp = await db_conn.collection("opportunities").insertOne(new_opportunity)

  await get_opportunities();

  logger.log("Oportunidade nova cadastrada");

  return new_opp;
}

async function update_opportunity(opportunity) {
  let db_conn = await db_utils.get_db();

  let edited_opp = await db_conn.collection("opportunities").replaceOne({_id: new ObjectId(opportunity._id)}, opportunity,{w: "majority", upsert: false});

  logger.log(`Modificados ${edited_opp.result.nModified} elementos`);

  await get_opportunities();

  return edited_opp;
}

module.exports = { get_opportunities, update_opportunity, register_opportunity };
