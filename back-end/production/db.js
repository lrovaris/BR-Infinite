const ObjectId = require('mongodb').ObjectId;
const cache = require('../memoryCache');
const logger = require('../logger')
const db_utils = require('../db.js');

async function get_production_entries() {
    let db_conn = await db_utils.get_db();

    let db_entries = await db_conn.collection("production_entries").find({}).toArray();

    cache.set("production_entries", db_entries)

    return db_entries;
}

async function register_entry(new_entries) {
  let db_conn = await db_utils.get_db();

  let new_entry = await db_conn.collection("production_entries").insertOne(new_entries)

  await get_production_entries();

  logger.log("Entrada nova cadastrada");

  return new_entry.ops[0];
}

module.exports = { get_production_entries, register_entry };
