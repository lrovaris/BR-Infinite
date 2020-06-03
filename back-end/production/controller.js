// Controladores internos
const { validate_entry, register_entries, validate_entries } = require ("./controllers/registerController")
const { get_entries } = require ("./controllers/defaultController")
const { get_seguradora_month_report, get_seguradora_dates } = require("./controllers/reportController")

module.exports = {
  get_entries,
  validate_entry,
  register_entries,
  validate_entries,
  get_seguradora_month_report,
  get_seguradora_dates
};
