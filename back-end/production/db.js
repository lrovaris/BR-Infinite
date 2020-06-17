const {
  get_production_entries,
  register_entry,
  update_entry
} = require("./dbs/entriesDb")

const {
  get_production_dates,
  register_production_date,
  update_production_date
} = require("./dbs/dateDb")

module.exports = {
  get_production_entries,
  register_entry,
  update_entry,
  get_production_dates,
  register_production_date,
  update_production_date
 };
