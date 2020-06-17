const db = require('../db');
const cache = require('../../memoryCache');
const logger = require('../../logger');

async function get_production_dates() {
  return cache.get('production_dates') || await db.get_production_dates();
}

async function register_production_date(date) {

  let all_prod_dates = await get_production_dates();

  let this_prod_date = all_prod_dates.find(prod_date_obj => {
    if(Number(prod_date_obj.year) !== Number(date.year)){
      return false
    }

    if(Number(prod_date_obj.month) !== Number(date.month)){
      return false
    }

    return true;
  })

  if(this_prod_date === undefined){
    let new_prod_date = await db.register_production_date(date).catch(err => logger.error(err));

    return new_prod_date
  }else {

    let entradas_editadas = Object.entries(this_prod_date)
    .map(([key, value]) =>{ return [key, date[key] || value]; })

    let entradas_novas = Object.entries(date).filter(([key,value]) => {
      let existente = entradas_editadas.find(([key_e, value_e]) => {
        return key_e === key;
      })
      return existente === undefined;
    })

    for (var i = 0; i < entradas_novas.length; i++) {
      entradas_editadas.push(entradas_novas[i])
    }

    let obj_editado = Object.fromEntries(entradas_editadas);

    let edited_date = await db.update_production_date(obj_editado).catch(err => logger.error(err));

    return edited_date;
  }
}

async function get_day_number_by_date(year, month) {
  let all_prod_dates = await get_production_dates();

  let prod_date = all_prod_dates.find(this_prod_date => {
    if(Number(this_prod_date.year) !== year){
      return false
    }

    if(Number(this_prod_date.month) !== month){
      return false
    }

    return true
  });

  if(prod_date !== undefined){
    return prod_date.dayNumber
  }else {
    return 20
  }
}


module.exports = {
  get_production_dates,
  register_production_date,
  get_day_number_by_date
};
