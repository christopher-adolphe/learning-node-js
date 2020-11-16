// Loading the Mongoose module
const mongoose = require('mongoose');

/**
 * A collection in MongoDB is similar to a table in the relational database context.
 * A document in MongoDB is similar to a row in the relational database context. Each document
 * is a container of key value pairs.
 * A schema in Mongoose is used to define the properties of a document in MongoDB.
*/

// Connecting to MongoBD
mongoose.connect('mongodb://127.0.0.1:27017/playground-db', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(error => console.error('Could not connect to MongoDB...', error));

// Defining a schema
const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: {type: Date, default: Date.now},
  isPublished: Boolean
});

// Compiling the schema into a model to obtain a Course class
const Course = mongoose.model('Course', courseSchema);

const createCourse = async () => {
  // Instantiating a course object from the Course class
  const course = new Course({
    name: 'Angular - The Complete Guide',
    author: 'Maximilian Schwarzmuller',
    tags: ['javascript', 'front-end'],
    isPublished: true
  });

  // Saving the document to the collection
  const result = await course.save();
  console.log(result);
};

createCourse();
