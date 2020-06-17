const { get_corretora_daily_report } = require("./corretoraReport/corretoraDailyReport")
const { get_corretora_monthly_report } = require("./corretoraReport/corretoraMonthlyReport")
const { get_corretora_yearly_report } = require("./corretoraReport/corretoraYearlyReport")

module.exports = {
  get_corretora_daily_report,
  get_corretora_monthly_report,
  get_corretora_yearly_report
};
