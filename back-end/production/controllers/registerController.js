// Imports padrão
const db = require('../db');
const default_controller = require('./defaultController')

// Controladores externos
const seguradora_controller = require("../../seguradoras/controller")
const corretora_controller = require('../../corretoras/controller')

async function validate_entries(rows, seg_id, this_date){

  const validated_rows = await Promise.all(
    rows.map(async row =>{
      let validation = await validate_entry(row, seg_id, this_date)

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

async function validate_entry(entry, seg_id, this_date) {
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
      "date": this_date
    }
  };
}

async function register_entries(entries){

  let current_entries = await default_controller.get_entries();


  let db_entries = await Promise.all(
    entries.map(async entry =>{

      let old_entry = current_entries.find(entry_obj =>{
        if (entry_obj.corretora.toString() !== entry.corretora.toString()){
          return false
        }

        if (entry_obj.seguradora.toString() !== entry.seguradora.toString()){
          return false
        }

        if (entry_obj.date.toString() !== entry.date.toString()){
          return false
        }

        return true

      })

      if(old_entry !== undefined){

        let entradas_editadas = Object.entries(old_entry)
        .map(([key, value]) =>{ return [key, entry[key] || value]; })

        let entradas_novas = Object.entries(entry).filter(([key,value]) => {
          let existente = entradas_editadas.find(([key_e, value_e]) => {
            return key_e === key;
          })
          return existente === undefined;
        })

        for (var i = 0; i < entradas_novas.length; i++) {
          entradas_editadas.push(entradas_novas[i])
        }

        let obj_editado = Object.fromEntries(entradas_editadas);

        let edited_entry = await db.update_entry(obj_editado).catch(err => console.error(err));

        return edited_entry

      }else {
        let new_entry = await db.register_entry(entry).catch(err => logger.error(err));
        return new_entry;
      }



    })
  )

  return db_entries;
}

module.exports = {
  validate_entry,
  register_entries,
  validate_entries
};
