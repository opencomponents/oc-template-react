module.exports = (options, callback) => {
  try {
    const html = options.template(options.model);
    return callback(null, html);
  } catch (error) {
    return callback(error);
  }
};
