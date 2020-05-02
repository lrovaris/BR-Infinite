const ObjectId = require('mongodb').ObjectId;
const cache = require('../memoryCache');
const logger = require('../logger');

const db_utils = require('../db.js');


async function get_colaboradores() {
  let db_conn = await db_utils.get_db();

  return new Promise((resolve, reject) => {
        db_conn.collection("colaboradores").find({}).toArray((err, result) =>{
            if(err){
                reject(err);
            }
            else {
                cache.set("colaboradores", result);
                resolve(result);
            }
        });
    });
}

async function register_colaborador(new_colaborador) {

  let db_conn = await db_utils.get_db();

  if(cache.get('colaboradores') === undefined){
    await get_colaboradores();
  }

  return new Promise((resolve, reject) => {
        db_conn.collection("colaboradores").insertOne(new_colaborador, async(err, result) => {
            if(err){
                reject(err);
            }else {
              let new_colaborador_list = cache.get('colaboradores');

                new_colaborador_list.push(new_colaborador);
                cache.set("colaboradores",new_colaborador_list);
                logger.log("Colaborador novo cadastrado");
                resolve(result);
            }
        });
    });
}

async function update_colaborador(colaborador) {
   colaborador._id = new ObjectId(colaborador._id);

   let db_conn = await db_utils.get_db();

  return new Promise((resolve, reject) => {
    db_conn.collection("colaboradores").replaceOne({_id: colaborador._id }, colaborador,{w: "majority", upsert: false} ,(err, result) =>{
      if(err){
          reject(err);
      }else{
        logger.log(`Modificados ${result.result.nModified} elementos`);

        resolve(result);
      }
    });
  });
}

module.exports = { get_colaboradores, update_colaborador, register_colaborador };
