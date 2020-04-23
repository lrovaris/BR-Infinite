const ObjectId = require('mongodb').ObjectId;
const cache = require('../memoryCache');
const logger = require('../logger')
const db_utils = require('../db.js');

async function get_produtos() {
    let db_conn = await db_utils.get_db();

    return new Promise((resolve, reject) => {
        db_conn.collection("produtos").find({}).toArray((err, result) =>{
            if(err){
                reject(err);
            }
            else {
                cache.set("produtos", result);
                resolve(result);
            }
        });
    });
}


async function register_produto(new_produto) {
  let db_conn = await db_utils.get_db();

  if(cache.get('produtos') === undefined){
    await get_produtos();
  }


  return new Promise((resolve, reject) => {
    db_conn.collection("produtos").insertOne(new_produto, (err, result) => {
      if(err){
        reject(err);
      }else {
        let new_produto_list = cache.get("produtos");
        new_produto_list.push(new_produto);
        cache.set("produtos",new_produto_list);
        logger.log("Produto novo cadastrado");
        resolve(result);
      }
    });
  });
}

async function update_produto(produto) {
  let db_conn = await db_utils.get_db();

   produto._id = new ObjectId(produto._id);

  return new Promise((resolve, reject) => {
    db_conn.collection("produtos").replaceOne({_id: produto._id }, produto,{w: "majority", upsert: false} ,(err, result) =>{
      if(err){
          reject(err);
      }else{
        logger.log(`Modificados ${result.result.nModified} elementos`);

        resolve(result);
      }
    });
  });
}

module.exports = { get_produtos, update_produto, register_produto };
