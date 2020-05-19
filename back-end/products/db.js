const ObjectId = require('mongodb').ObjectId;
const cache = require('../memoryCache');
const logger = require('../logger')
const db_utils = require('../db.js');

async function get_produtos() {
    let db_conn = await db_utils.get_db();

    let all_prods = await db_conn.collection("produtos").find({}).toArray();

    cache.set("produtos", all_prods)

    return all_prods;
}


async function register_produto(new_produto) {
  let db_conn = await db_utils.get_db();

  let new_prod = await db_conn.collection("produtos").insertOne(new_produto)

  await get_produtos();

  logger.log("Produto novo cadastrado");

  return new_prod;
}

async function update_produto(produto) {
  let db_conn = await db_utils.get_db();

  produto._id = new ObjectId(produto._id)

  let edited_prod = await db_conn.collection("produtos").replaceOne({_id: produto._id}, produto,{w: "majority", upsert: false});

  logger.log(`Modificados ${edited_prod.result.nModified} elementos`);

  await get_produtos();

  return edited_prod;
}

module.exports = { get_produtos, update_produto, register_produto };
