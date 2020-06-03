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

  return db_corr;
}

async function validate_corretora(corretora) {
  if (corretora === undefined){
    return{
      "valid": false,
      "message": "Corretora inválida"
    }
  }

  if(corretora.nicknames){
    for (var i = 0; i < corretora.nicknames.length; i++) {

      let nic_corr = await get_corretora_by_nickname(corretora.nicknames[i])

      if(nic_corr === undefined){
        continue;
      }

      if(!corretora._id){
        return{
          "message":"Apelido em uso",
          "valid":false
        }
      }

      if(corretora._id.toString() !== nic_corr._id.toString()){
        return{
          "message":"Apelido em uso",
          "valid":false
        }
      }

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

async function get_corretora_by_nickname(nickname){
  let all_corr = await get_corretoras();

  let corretora = all_corr.find(corr_obj =>{
    if(!corr_obj.nicknames){
      return false;
    }

    return (corr_obj.nicknames.includes(nickname));
  });
    
  return corretora;
}

async function get_corretoras_by_seguradora(seg_id) {
  let corrs = await get_corretoras();

  corrs = corrs.filter(corr =>{
    if(corr.seguradoras === undefined){
      return false
    }else {
      if(!corr.seguradoras.includes(seg_id)){
        return false
      }else {
        return true
      }
    }
  });

  return corrs;
}


module.exports = { get_corretoras, get_corretora_by_id, validate_corretora, register_corretora, get_corretora_by_nickname, get_corretoras_by_seguradora};
