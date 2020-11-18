// Loading the Mongoose module
const mongoose = require('mongoose');

/**
 * MongoDB is a document database. Its stores JSON objects.
 * A collection in MongoDB is similar to a table in the relational database context.
 * A document in MongoDB is similar to a row in the relational database context. Each document
 * is a container of key value pairs.
 * 
 * Mongoose is a schema-based solution to model application data.
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
    name: 'Vue.js - The Complete Guide',
    author: 'Maximilian Schwarzmuller',
    tags: ['javascript', 'front-end'],
    isPublished: true
  });

  // Saving the document to the collection
  try {
    const result = await course.save();
    console.log(result);
  } catch(error) {
    console.error('Sorry could not create course', error);
  }
};

// createCourse();

const getCourses = async () => {
  /**
   * MongoDB comparison operators
   * 
   * eq - equal
   * ne - not equal
   * gt - greater than
   * gte - greater than or equal to
   * lt- less than
   * lte less than or equal to
   * in
   * nin - not in
   * 
   * e.g: Course.find({price: {$gte: 10, $lte: 20}})
   * e.g: Course.find({price: {$in: [10, 20, 30]}})
  */

  /**
   * MongoDB logical operators
   * 
   * or
   * and
   * 
   * e.g: Course.find().or([{author: 'Max'}, {isPublished: true}])
   * e.g: Course.find().and([{author: 'Max'}, {isPublished: true}])
  */

  /**
   * Query filter with regular expression
   * 
   * Starts with John
   * e.g Course.find({author: /^John/})
   * 
   * Ends with Doe and case insensitive
   * e.g Course.find({author: /Doe$/i})
   */

  // Contains John
  // e.g Course.find({author: /.*John.*/i})

  /**
   * Pagination
   * 
   * const pageNumber = 2;
   * const pageSize = 10;
   * 
   * Course.find().skip((pageNumber - 1) * pageSize).limit(pageSize)
  */

  // Fetching the courses documents
  try {
    const courses = await Course
      .find()
      .or([{author: 'Mosh Hamedani'}])
      .limit(10)
      .sort({name: -1})
      .select({name: 1, tags: 1})
    console.log(courses);
  } catch(error) {
    console.error('Sorry could not fetch courses', error);
  }
};

getCourses();
