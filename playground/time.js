var moment = require('moment');

var date = new Date();
console.log(date.getMonth());

var date2 = moment();
console.log(date2.format('MMMM Do YYYY'));

var someTimestamp = moment().valueOf();
console.log(someTimestamp);