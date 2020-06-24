const corretora_controller = require('../../corretoras/controller')
const colaborador_controller = require('../../colaboradores/controller')
const product_controller = require('../../products/controller')
const seguradora_controller = require('../../seguradoras/controller')

async function formatToResponse(all_opportunities) {

  let norm_opp = await Promise.all (all_opportunities.map(async(obj) =>{
    let this_corr = await corretora_controller.get_corretora_by_id(obj.corretora._id || obj.corretora);

    if(this_corr !== undefined){
      obj.corretora = {
        name: this_corr.name,
        _id: this_corr._id
      }
    }


    let this_seg = await seguradora_controller.get_seguradora_by_id(obj.seguradora._id || obj.seguradora);

    if (this_seg !== undefined){
      obj.seguradora = {
        name: this_seg.name,
        _id: this_seg._id
      }
    }


    let this_colab = await colaborador_controller.get_colaboradores_by_id(obj.colaborador._id || obj.colaborador);

    if(this_colab !== undefined){
      obj.colaborador = {
        name: this_colab.name,
        _id: this_colab._id
      }
    }


    let this_prod = await product_controller.get_produto_by_id(obj.product._id || obj.product);

    if(this_prod !== undefined){
      obj.product = {
        name: this_prod.name,
        _id: this_prod._id
      }
    }


    return obj;
  }))

  return norm_opp

}

module.exports = { formatToResponse };
