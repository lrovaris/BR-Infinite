const db = require('./db');
const corretora_controller = require('../corretoras/controller')
let cache = require('../memoryCache');

async function get_entries() {
  return cache.get('production_entries') || await db.get_production_entries();
}

async function validate_entry(entry) {
  if (entry === undefined){
    return{
      "valid": false,
      "message": "Entrada inválida"
    }
  }

  let corr = await corretora_controller.get_corretora_by_nickname(entry.Corretora)

  if(corr === undefined){
    return{
      "valid": false,
      "message": `Corretora ${entry.Corretora} inválida, apelido desconhecido`
    }
  }


  if(!entry.Total){
    return{
      "valid": false,
      "message": `Valor monetário inválido`
    }
  }

  let thisTotal = entry.Total;
  thisTotal = thisTotal.replace("R$ ","")
  thisTotal = thisTotal.replace(",","")
  thisTotal = thisTotal.replace(".","")
  thisTotal = Number(thisTotal)/100

  if(isNaN(thisTotal)){
    return{
      "valid": false,
      "message": `Valor monetário inválido`
    }
  }

  return {
    "valid":true,
    "entry":{
      "corretora": corr._id.toString(),
      "total": thisTotal,
      "date": entry.Data
    }
  };
}

async function register_entries(entries){
  let db_entries = [];

  Promise.all(
    entries.map(async entry =>{
      let new_entry = await db.register_entry(entry).catch(err => logger.error(err));
      db_entries.push(new_entry)
    })
  )

  return db_entries;
}


module.exports = { get_entries, validate_entry, register_entries };
