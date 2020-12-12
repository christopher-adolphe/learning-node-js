const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/relationship-referenced', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(error => console.error('Could not connect to MongoDB...', error));

const Author = mongoose.model('Author', new mongoose.Schema({
  name: String,
  bio: String,
  website: String
}));

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  // Creating an 'author' propery and setting it's type to objectId to store the Id of the related author
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author' // Name of the target collection
  }
}));

async function createAuthor(name, bio, website) { 
  const author = new Author({
    name, 
    bio, 
    website 
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author) {
  const course = new Course({
    name, 
    author
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  /**
   * Using the populate() method to execute a separate query to get the target collection.
   * @param path — either the path to populate or an object specifying all parameters
   * @param select — Field selection for the population query
  */

  const courses = await Course
    .find()
    .populate('author', 'name -_id')
    .select('name author');
  console.log(courses);
}

// createAuthor('Josh', 'My bio', 'My Website');

// createCourse('Node Course', '5fd4de4f341850058076b3be');

listCourses();
