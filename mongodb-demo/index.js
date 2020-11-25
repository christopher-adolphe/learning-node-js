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

/**
 * Defining a schema and adding validation.
 * 
 * This validation is provided by Mongoose. MongoDB is not aware of any kind of validation.
*/
const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 225,
    // match: /pattern/ For validation using regular expressions
  },
  author: String,
  tags: {
    type: Array,
    /**
     * Creating a custom validator.
     * 
     * The validator property takes a function which takes the value as a parameter against
     * which we perform the validation logic.
     * The message property is used to send a custom message relevant to the custom
     * validation we have created.
    */
    validate: {
      validator: function(value) {
        return value && value.length > 0;
      },
      message: 'A course should have a least one tag.'
    }
  },
  category: {
    type: String,
    enum: ['web', 'mobile', 'network'],
    required: true
  },
  date: {type: Date, default: Date.now},
  isPublished: Boolean,
  price: {
    type: Number,
    required: function() { return this.isPublished } // Should not use arrow function here because it will not have the context of 'this' with respect to the schema object
  }
});

// Compiling the schema into a model to obtain a Course class
const Course = mongoose.model('Course', courseSchema);

const createCourse = async () => {
  // Instantiating a course object from the Course class
  const course = new Course({
    name: 'Spring Boot Microservices - The Complete Guide',
    author: 'Baeldug',
    tags: null,
    category: 'web',
    isPublished: true,
    price: 20
  });

  // Saving the document to the collection
  try {
    // Triggering validation manually
    // await course.validate();

    const result = await course.save();
    console.log(result);
  } catch(error) {
    console.error('Sorry could not create course. ', error.message);
  }
};

createCourse();

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
  } catch (error) {
    console.error('Sorry could not fetch courses. ', error.message);
  }
};

// getCourses();

const updateCourse = async (id) => {
  /**
   * Query first approach.
   * 
   * 1) Use findById()
   * 2) Modify the properties of the document
   * 3) save()
  */
  const course = await Course.findById(id);

  if (!course) {
    return;
  }

  course.set({
    isPublished: true,
    author: 'Christopher Adolphe'
  });

  try {
    const result = await course.save();
    console.log(result);
  } catch (error) {
    console.error('Sorry could not update course. ', error.message);
  }
};

// updateCourse('5fb418bd2136bb03b31723b4');

const updateCourseV2 = async (id) => {
  /**
   * Update first approach.
   * 
   * 1) Use update() which takes a filter query object as it's first parameter
   * and a mongoDB update operator as second parameter
  */
  const result = await Course.update({_id: id}, {
    $set: {
      author: 'John Doe',
      isPublished: false
    }
  });

  console.log(result);
};

// updateCourseV2('5fb418bd2136bb03b31723b4');

const updateCourseV3 = async (id) => {
  /**
   * Update first approach and get updated
   * 
   * 1) Use findByIdAndUpdate()
   * 2) Note that findByIdAndUpdate() returns the original document
   * 3) To get the updated document, we pass a 3rd parameter to findByIdAndUpdate()
  */
  const course = await Course.findByIdAndUpdate(id, {
    $set: {
      author: 'Aurore Virassamy',
      isPublished: true
    }
  }, {new: true});

  console.log(course);
};

// updateCourseV3('5fb418bd2136bb03b31723b4');

const deleteCourse = async (id) => {
  try {
    /**
     * The deleteOne() take a filter query object and deletes the first document
     * which matches the filter.
     */
    const result = await Course.deleteOne({_id: id});
    console.log(result);
  } catch (error) {
    console.error('Sorry, could not delete course. ', error.message);
  }
};

// deleteCourse('5fb418bd2136bb03b31723b4');

const findAndDeleteCourse = async (id) => {
  try {
    /**
     * If we want to get the document to be deleted, use findByIdAndRemove() which
     * takes the id of the document to be deleted.
     */
    const course = await Course.findByIdAndRemove({_id: id});
    console.log(course);
  } catch (error) {
    console.error('Sorry, could not delete course. ', error.message);
  }
};

// findAndDeleteCourse('5fb418bd2136bb03b31723b4');
