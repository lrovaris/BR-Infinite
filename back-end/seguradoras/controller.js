const db = require('./db');
let cache = require('../memoryCache');

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

module.exports = { get_seguradoras, get_seguradora_by_id };
