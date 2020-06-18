const {
  get_corretoras,
  get_corretora_by_id,
  register_corretora,
  validate_corretora,
  get_corretora_by_nickname,
  get_corretoras_by_seguradora
} = require("./controllers/defaultController")

const {
  get_corretora_csv,
  get_all_corretoras_csv
} = require("./controllers/csvController")

module.exports = {
  get_corretoras,
  get_corretora_by_id,
  validate_corretora,
  register_corretora,
  get_corretora_by_nickname,
  get_corretoras_by_seguradora,
  get_corretora_csv,
  get_all_corretoras_csv
};
