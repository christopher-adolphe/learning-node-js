// Loading Mongoose module
const mongoose = require('mongoose');
// Loading Winston module
const winston = require('winston');

module.exports = () => {
  mongoose.connect('mongodb://127.0.0.1:27017/vidly', { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }).then(() => winston.info('Connected to MongoDB'))
}
