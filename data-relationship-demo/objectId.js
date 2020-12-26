/*
 * _id: 5fc930dc4ff6fe0a2c6b2e3c
 * An object id consists of 24 characters and each 2 characters represent a byte.
 * The object id is therefore 12 bytes and these bytes are divided into the following way
 * to uniquely identifier a document:
 * 
 * - 1st 4 bytes: timestamp
 * - next 3 bytes: machine identifier
 * - next 2 bytes: process identifier
 * - last 3 bytes: counter
 * 
 * Side note 1 byte = 8 bits
*/

const mongoose =  require('mongoose');
const id = mongoose.Types.ObjectId();

console.log(id.getTimestamp());

const isIdValid = mongoose.Types.ObjectId.isValid(id);

console.log(isIdValid);
