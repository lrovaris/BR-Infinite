const { get_seguradora_daily_compare } = require("./seguradoraCompare/seguradoraDailyCompare")
const { get_seguradora_monthly_compare } = require("./seguradoraCompare/seguradoraMonthlyCompare")
const { get_seguradora_yearly_compare } = require("./seguradoraCompare/seguradoraYearlyCompare")

module.exports = {
  get_seguradora_daily_compare,
  get_seguradora_monthly_compare,
  get_seguradora_yearly_compare
};
