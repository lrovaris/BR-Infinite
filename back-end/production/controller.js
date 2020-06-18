// Controladores internos
const {
  validate_entry,
  register_entries,
  validate_entries
} = require ("./controllers/registerController")

const {
  get_seguradora_dates,
  get_seguradora_yearly_report,
  get_seguradora_daily_report,
  get_seguradora_daily_report_csv,
  get_seguradora_monthly_report,
  get_seguradora_daily_compare,
  get_seguradora_monthly_compare,
  get_seguradora_yearly_compare,
  get_seguradora_home_reports,
  get_corretora_dates,
  get_corretora_daily_report,
  get_corretora_monthly_report,
  get_corretora_yearly_report,
  get_corretora_daily_compare,
  get_corretora_monthly_compare,
  get_corretora_yearly_compare
} = require("./controllers/reportController")

const {
  get_production_dates,
  register_production_date
} = require("./controllers/dateController")

const {
  get_entries
} = require ("./controllers/defaultController")

module.exports = {
  get_entries,
  validate_entry,
  register_entries,
  validate_entries,
  get_seguradora_yearly_compare,
  get_seguradora_daily_report,
  get_seguradora_daily_report_csv,
  get_seguradora_monthly_report,
  get_seguradora_yearly_report,
  get_seguradora_daily_compare,
  get_seguradora_monthly_compare,
  get_seguradora_dates,
  get_seguradora_home_reports,
  get_corretora_dates,
  get_corretora_daily_report,
  get_corretora_monthly_report,
  get_corretora_yearly_report,
  get_corretora_daily_compare,
  get_corretora_monthly_compare,
  get_corretora_yearly_compare,
  get_production_dates,
  register_production_date
};
