const db = require('../db');
const cache = require('../../memoryCache');

async function get_entries() {
  return cache.get('production_entries') || await db.get_production_entries();
}

module.exports = {
  get_entries
};
