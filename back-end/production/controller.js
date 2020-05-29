const db = require('./db');
const seguradora_controller = require("../seguradoras/controller")
const corretora_controller = require('../corretoras/controller')
let cache = require('../memoryCache');

//Todas as entradas
async function get_entries() {
  return cache.get('production_entries') || await db.get_production_entries();
}

// ----- Funções de registro de entradas ----- Início -----
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

  // console.log("corr", corr);

  if(corr === undefined){
    return{
      "valid": false,
      "message": `Corretora ${entry.Corretora} inválida, apelido desconhecido`
    }
  }else {
    if(corr.seguradoras === undefined){
      return{
        "valid": false,
        "message": `A corretora ${corr.name} (apelido ${entry.Corretora}) não trabalha com esta seguradora`
      }
    }else {
      if(!corr.seguradoras.includes(seg_id)){
        return{
          "valid": false,
          "message": `A corretora ${corr.name} (apelido ${entry.Corretora}) não trabalha com esta seguradora`
        }
      }
    }
    // console.log("corr.seguradoras", corr.seguradoras);
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
// ----- Funções de registro de entradas ----- Fim -----

// ----- Funções de relatório ----- Início -----
async function get_seguradora_report(seg_id){
  let all_prods = await get_entries();

  let this_seg_prods = all_prods.filter(prod => prod.seguradora === seg_id)

  let this_corrs = await corretora_controller.get_corretoras_by_seguradora(seg_id);

  let formated_data = this_corrs.map(corr => {
    let this_corr_prod = this_seg_prods.filter(prod => prod.corretora.toString() === corr._id.toString())

    console.log(this_corr_prod);

    let ordered_array = this_corr_prod.sort((prod_a, prod_b) => {
      return isTheNewDateBigger(prod_b.date, prod_a.date) ? 1 : -1
    });

    let last_prod = ordered_array[ordered_array.length-1]
    let date;
    let total;
    let media;
    let projection;
    let warning;

    if(last_prod !== undefined){
      let this_month_util_days;
      let dias_faltando;

      this_month_util_days = ordered_array.filter(prod => getDateInfoFromString(prod.date).month === getDateInfoFromString(last_prod.date).month).length
      date = last_prod.date;
      total = last_prod.total
      media = (last_prod.total / this_month_util_days).toFixed();
      dias_faltando =  (((30 - getDateInfoFromString(last_prod.date).day) * 2) / 3).toFixed();
      projection = last_prod.total + (dias_faltando * media);

    }else {

      warning = "Corretora sem produção!"

    }

    return {
      corretora: corr.name,
      date: date,
      total: total,
      media: media,
      projection: projection,
      warning: warning
    };
  });

  return formated_data;
}
// ----- Funções de relatório ----- Fim -----

// ------- Date Utils ------- Início -------
function getDateInfoFromString(date) {
  return {
    day: date.split("/")[0],
    month: date.split("/")[1],
    year: date.split("/")[2]
  }
}

function isTheNewDateBigger(oldDate, newDate) {

  let dataNew = getDateInfoFromString(newDate);

  let dataOld = getDateInfoFromString(oldDate);

  if (dataNew.year < dataOld.year) {
    return false
  } else if ( (dataNew.year >= dataOld.year) ) {
    if (dataNew.month < dataOld.month) {
      return false
    } else if ( dataNew.month >= dataOld.month) {
      if (dataNew.day < dataOld.day) {
        return false
      } else if ( dataNew.day > dataOld.day ) {
        return true
      }
      if (dataNew.month > dataOld.month) {
        return true
      }
    }
    return dataNew.year > dataOld.year;
  }
}
// ------- Date Utils ------- Fim -------

module.exports = { get_entries, validate_entry, register_entries, validate_entries, get_seguradora_report };
