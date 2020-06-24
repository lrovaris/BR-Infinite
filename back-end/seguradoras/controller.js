
const {
  get_seguradoras,
  get_seguradora_by_id,
  validate_seguradora,
  register_seguradora,
  get_seguradoras_by_id_array,
  get_filtered_seguradoras
} = require("./controllers/defaultController")

const {
  get_seguradora_csv,
  get_all_seguradoras_csv
} = require("./controllers/csvController")



module.exports = {
  get_seguradoras,
  get_seguradora_by_id,
  validate_seguradora,
  register_seguradora,
  get_seguradoras_by_id_array,
  get_seguradora_csv,
  get_all_seguradoras_csv,
  get_filtered_seguradoras
};
