// Loading Mongoose module
const mongoose = require('mongoose');
// Loading Winston module
const winston = require('winston');
// Loading Config module
const config = require('config');

module.exports = () => {
  const db = config.get('db');
  
  mongoose.connect(db, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }).then(() => {
      winston.info(`Connected to ${db}`);
    });
}
