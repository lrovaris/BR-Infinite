module.exports = {
  log: function (to_log) { if(global.env === 'dev') console.log(to_log); },
  error: function (to_error) { if(global.env === 'dev') console.error(to_error); }
}
