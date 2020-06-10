const default_controller = require('./defaultController')
const date_utils = require('../utils/dateUtils')
const corretora_controller = require('../../corretoras/controller')

const { get_seguradora_dates } = require("./report/seguradoraDefaultController")
const { get_seguradora_daily_report, get_seguradora_monthly_report, get_seguradora_yearly_report, get_seguradora_home_reports } = require("./report/seguradoraReportController")
const { get_seguradora_daily_compare, get_seguradora_monthly_compare, get_seguradora_yearly_compare } = require("./report/seguradoraCompareController")

const { get_corretora_dates } = require("./report/corretoraDefaultController")
const { get_corretora_daily_report, get_corretora_monthly_report, get_corretora_yearly_report } = require("./report/corretoraReportController")
const { get_corretora_daily_compare, get_corretora_monthly_compare, get_corretora_yearly_compare } = require("./report/corretoraCompareController")


module.exports = {
  get_seguradora_dates,
  get_seguradora_daily_report,
  get_seguradora_monthly_report,
  get_seguradora_yearly_report,
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
};
