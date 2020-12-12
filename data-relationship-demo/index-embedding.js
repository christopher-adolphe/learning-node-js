const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/relationship-embedded', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected to MongoDB...'))
  .catch(error => console.error('Could not connect to MongoDB...', error));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  // Creating an 'author' property and setting it to the 'authorSchema'
  authors: [
    {
      type: authorSchema,
      required: true
    }
  ]
}));

async function createCourse(name, authors) {
  const course = new Course({
    name, 
    authors
  }); 
  
  const result = await course.save();
  console.log(result);
}

async function listCourses() { 
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseId, authorName) {
  // Using the findById() method to get the course and update it in memory before saving it back in the database
  const course = await Course.findById(courseId);

  course.author.name = authorName;

  /**
   * When updating an embedded document we call the save() method on the parent document like course.save()
   * We cannot do something like course.author.save()
  */
  const result = await course.save();
  console.log(result);
}

async function updateAuthorAlternative(courseId, authorName) {
  // Using the updateOne() method to directly update the embedded document
  const course = await Course.updateOne({ _id: courseId }, {
    $set: {
      'author.name': authorName
    }
  });

  console.log(course);
}

async function removeEmbeddedDoc(courseId) {
  const course = await Course.updateOne({ _id: courseId }, {
    // Using the $unset operator to remove the embedded author document
    $unset: {
      'author': ''
    }
  });

  console.log(course);
}

async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);

  course.authors.push(author);

  const result = await course.save();
  console.log(result);
}

async function removeAuthor(courseId, authorId) {
  const course = await Course.findById(courseId);

  // Using the id() method on the embedded array to find the sub-document which matches the specified id
  const author = course.authors.id(authorId);

  // Using the remove() method to remove the embedded document from the array of embedded documents
  const removedResult = await author.remove();
  const savingResult = await course.save();

  console.log(removedResult);
  console.log(savingResult);
}

// createCourse('F1 Driving 101', [
//   new Author({ name: 'Lewis Hamilton' }),
//   new Author({ name: 'Daniel Ricciardo' })
// ]);

// updateAuthor('5fd4ded108af1c05b3b729d5', 'Max Kyvat');

// updateAuthorAlternative('5fd4ded108af1c05b3b729d5', 'Samuel Fisher');

// removeEmbeddedDoc('5fd4ded108af1c05b3b729d5');

// addAuthor('5fd4e46dd1ae93066d42dd52', new Author({ name: 'Max Verstappen' }));

removeAuthor('5fd4e46dd1ae93066d42dd52', '5fd4e5df6573b6069d9902b7');