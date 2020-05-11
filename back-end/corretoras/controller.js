const db = require('./db');
let cache = require('../memoryCache');

async function get_corretoras() {
  return cache.get('corretoras') || await db.get_corretoras();
}

async function get_corretora_by_id(corr_id) {
  let all_corr = await get_corretoras();

  let corretora = all_corr.find(corr_obj =>{
    return (corr_obj._id.toString() == corr_id.toString());
  });

  return corretora;
}

async function register_corretora(new_corr){
let db_corr = await db.register_corretora(new_corr).catch(err => logger.error(err));

return db_corr.ops[0];
}

function validate_corretora(corretora) {
  if (corretora === undefined){
    return{
      "valid": false,
      "message": "Corretora inválida"
    }
  }

  if (!corretora.name){
    return {
      "message":"Campo de nome da corretora vazio",
      "valid":false
    };
  }

  return {"valid":true};
}

module.exports = { get_corretoras, get_corretora_by_id, validate_corretora, register_corretora};
