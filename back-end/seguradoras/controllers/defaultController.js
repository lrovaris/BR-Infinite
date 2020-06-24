const db = require('../db');
let cache = require('../../memoryCache');
const logger = require('../../logger')

async function get_seguradoras() {
  return cache.get('seguradoras') || await db.get_seguradoras();
}

async function get_seguradora_by_id(seg_id){
  let all_seg = await get_seguradoras();

  let seguradora = all_seg.find(seg_obj =>{
    return (seg_obj._id.toString() == seg_id.toString())
  });

  return seguradora;
}

async function get_seguradoras_by_id_array(seg_ids){
  let all_seg = await get_seguradoras();

  let resp = all_seg.filter(seg_obj =>{
    if(seg_obj === undefined){
      return false
    }

    if(!seg_obj._id){
      return false
    }

    if(seg_obj._id === undefined){
      return false
    }

    if(seg_ids === undefined){
      return false
    }

    return (seg_ids.includes(seg_obj._id.toString()))
  });

  return resp;
}

async function register_seguradora(new_seg){
  let db_seg = await db.register_seguradora(new_seg).catch(err => logger.error(err));

  return db_seg;
}

async function validate_seguradora(seguradora){
  if (seguradora === undefined){
    return{
      "valid": false,
      "message": "Seguradora inválida"
    }
  }

  if (!seguradora.name){
    return {
      "valid": false,
      "message":"Campo de nome da seguradora vazio"
    };
  }

  return{ valid: true }
}

async function get_filtered_seguradoras(filter_params) {

  for (var i = 0; i < filter_params.length; i++) {
    if(filter_params[i].type !== "name" && filter_params[i].type !== "address"){
      return{
        valid: false,
        message: `Tipo ${filter_params[i].type} não identificado`
      }
    }
  }

  const all_seguradoras = await get_seguradoras()

  let filtered_seguradoras = all_seguradoras.filter(seg_obj => {

    for (var i = 0; i < filter_params.length; i++) {
      if (filter_params[i].value === "" || filter_params[i].value === " "){
        continue;
      }

      if (filter_params[i].type === "name"){

        if(!seg_obj.name.toLowerCase().includes(filter_params[i].value.toLowerCase())){
          return false
        }
      }

      if(filter_params[i].type === "address"){

        if(!seg_obj.address.estate.toLowerCase().includes(filter_params[i].value.toLowerCase()) && !seg_obj.address.city.toLowerCase().includes(filter_params[i].value.toLowerCase())){
          return false
        }

      }
    }

    return true
  })

  return{
    valid: true,
    data: filtered_seguradoras
  }
}

module.exports = {
  get_seguradoras,
  get_seguradora_by_id,
  validate_seguradora,
  register_seguradora,
  get_seguradoras_by_id_array,
  get_filtered_seguradoras
};
