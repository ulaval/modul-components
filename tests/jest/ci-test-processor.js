module.exports = function() {
     require('../../node_modules/jest-junit').apply(this, arguments);
     return require('../../node_modules/jest-html-reporter').apply(this, arguments);
 };
