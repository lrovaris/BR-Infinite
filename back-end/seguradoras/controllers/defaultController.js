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

module.exports = { get_seguradoras, get_seguradora_by_id, validate_seguradora, register_seguradora, get_seguradoras_by_id_array };
