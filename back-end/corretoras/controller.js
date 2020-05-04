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

function validate_corretora(corretora) {
  if (corretora === undefined){
    return{
      "valid": false,
      "message": "Corretora inválido"
    }
  }

  if (!corretora.name){
    return {
      "message":"Campo de nome da corretora vazio",
      "valid":false
    };
  }

  if (!corretora.cnpj){
    return {
      "message":"Campo de CNPJ vazio",
      "valid":false
    };
  }

  if (!corretora.telephone){
    return {
      "message":"Campo de telefone da corretora vazio",
      "valid":false
    };
  }

  if (!corretora.email){
    return {
      "message":"Campo de email da corretora vazio",
      "valid":false
    };
  }

  if (!corretora.address){
    return {
      "message":"Campo de endereço vazio",
      "valid":false
    };
  }

  if (!corretora.seguradoras){
    return {
      "message":"Campo de seguradoras vazio",
      "valid":false
    };
  }

  return {"valid":true};
}

module.exports = { get_corretoras, get_corretora_by_id, validate_corretora};
