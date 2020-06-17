const { get_corretora_daily_compare } = require("./corretoraCompare/corretoraDailyCompare");
const { get_corretora_monthly_compare } = require("./corretoraCompare/corretoraMonthlyCompare");
const { get_corretora_yearly_compare } = require("./corretoraCompare/corretoraYearlyCompare");

module.exports = {
  get_corretora_daily_compare,
  get_corretora_monthly_compare,
  get_corretora_yearly_compare
};
