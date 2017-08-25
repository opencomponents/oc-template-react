"use strict";

const Cache = require("nice-cache");
const cache = new Cache({});

module.exports = function(type, key, predicate, callback) {
  const cached = cache.get(type, key);

  if (cached) {
    return callback(null, cached);
  }

  predicate((err, res) => {
    if (err) {
      return callback(err);
    }

    cache.set(type, key, res);
    callback(null, res);
  });
};
