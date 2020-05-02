const db = require('./db');
let cache = require('../memoryCache');

async function get_seguradoras() {
  let all_seguradoras = cache.get('seguradoras');

  if(all_seguradoras !== undefined){
    return all_seguradoras;
  }else {
    all_seguradoras = await db.get_seguradoras();
    return all_seguradoras;
  }
}

async function get_seguradora_by_id(seg_id){
  let all_seg = await get_seguradoras();

  let seguradora = all_seg.filter(seg_obj =>{
    return (seg_obj._id.toString() == seg_id.toString())
  })[0];

  return seguradora;
}

module.exports = { get_seguradoras, get_seguradora_by_id };
