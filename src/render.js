module.exports = (options, callback) =>
  callback(null, options.template(options.model));
