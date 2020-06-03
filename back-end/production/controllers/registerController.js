// Imports padrão
const db = require('../db');
const cache = require('../../memoryCache');

// Controladores externos
const seguradora_controller = require("../../seguradoras/controller")
const corretora_controller = require('../../corretoras/controller')

async function validate_entries(rows, seg_id){

  const validated_rows = await Promise.all(
    rows.map(async row =>{
      let validation = await validate_entry(row, seg_id)

      let to_db = validation.entry;

      if(validation.valid){
        to_db.sentDate = new Date();
        to_db.seguradora = seg_id;
      }

      return {
        entry: to_db,
        valid: validation.valid,
        message: validation.message
      };
      }
    )
  )

  return validated_rows;
}

async function validate_entry(entry, seg_id) {
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
      "message": `Corretora "${entry.Corretora}" inválida, apelido desconhecido`
    }
  }else {
    if(corr.seguradoras === undefined){
      return{
        "valid": false,
        "message": `A corretora ${corr.name} (apelido ${entry.Corretora}) não tem nenhuma seguradora listada`
      }
    }else {
      if(!corr.seguradoras.includes(seg_id)){
        console.log(JSON.stringify(corr, null, 1));
        return{
          "valid": false,
          "message": `A corretora ${corr.name} (apelido ${entry.Corretora}) não trabalha com esta seguradora`
        }
      }
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
  let db_entries = await Promise.all(
    entries.map(async entry =>{
      let new_entry = await db.register_entry(entry).catch(err => logger.error(err));
      return new_entry;
    })
  )

  return db_entries;
}

module.exports = {
  validate_entry,
  register_entries,
  validate_entries
};
