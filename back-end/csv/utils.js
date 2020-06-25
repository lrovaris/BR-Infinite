const fs = require('fs');
const csv = require('fast-csv');

const iconv = require('iconv-lite');

function writeCsv(csv_name, csv_data, callback) {

  let ws = fs.createWriteStream(`./relatorios/${csv_name}.csv`, {encoding: 'utf8'})

  csv
  .write(csv_data, {headers: false})
  .pipe(iconv.decodeStream('utf8'))
  .pipe(iconv.encodeStream('binary'))
  .pipe(ws)
  .on('close', () => {
    callback({
      valid: true,
      path: `${csv_name}.csv`
    })
  })
  .on('error', () => {
    callback({
      valid: false
    })
  })

}

module.exports = { writeCsv };
