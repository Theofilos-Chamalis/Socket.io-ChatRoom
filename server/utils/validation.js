// Enable strict JS mode globally to prevent common errors
'use strict';

var isRealString = str => {
  return typeof str === 'string' && str.trim().length > 0;
};

module.exports = { isRealString };
