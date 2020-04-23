const ObjectId = require('mongodb').ObjectId;
const cache = require('../memoryCache');
const controller = require('./controller')
const logger = require('../logger');


function get_colaboradores() {
  return new Promise((resolve, reject) => {
        global.db.collection("colaboradores").find({}).toArray((err, result) =>{
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
    return new Promise((resolve, reject) => {
        global.db.collection("colaboradores").insertOne(new_colaborador, async(err, result) => {
            if(err){
                reject(err);
            }else {
              let new_colaborador_list = await controller.get_colaboradores();
                new_colaborador_list.push(new_colaborador);
                cache.set("colaboradores",new_colaborador_list);
                logger.log("Colaborador novo cadastrado");
                resolve(result);
            }
        });
    });
}

function update_colaborador(colaborador) {
   colaborador._id = new ObjectId(colaborador._id);

  return new Promise((resolve, reject) => {
    global.db.collection("colaboradores").replaceOne({_id: colaborador._id }, colaborador,{w: "majority", upsert: false} ,(err, result) =>{
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
