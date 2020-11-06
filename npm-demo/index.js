const _ = require('underscore');

let numberList = [1, 2, 3];
let isInList = _.contains(numberList, 8);

if (isInList) {
  console.log('Found in list');
} else {
  console.log('Not found in list');
}
