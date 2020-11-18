const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/mongo-exercises', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Successfully connected to MongoDB...'))
  .catch((error) => console.error('Could not connect to MongoDB: ', error.message));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  price: Number,
  isPublished: Boolean,
  date: {type: Date, default: Date.now}
});

const Course = mongoose.model('Course', courseSchema);

const getBackendCourses = async () => {
  try {
    return await Course
      .find({isPublished: true, tags: 'backend'})
      .sort({name: 1}) // alternative .sort('name') for ascending and .sort('-name') for descending
      .select({name: 1, author: 1}) // alternative .select('name author)
  } catch(error) {
    console.log('Could not get courses ', error.message);
  }
};

const getFrontendBackendCourses = async () => {
  try {
    return await Course
      .find({isPublished: true, tags: {$in: ['frontend', 'backend']}})
      // alternatively .or([{tags: 'frontend'}, {tags: 'backend'}])
      .sort('-price')
      .select('name author price')
  } catch(error) {
    console.log('Could not get courses ', error.message);
  }
};

const getExpensiveCourses = async () => {
  try {
    return await Course
      .find({isPublished: true})
      .or([{price: {$gte: 15}}, {name: /.*by.*/i}])
      .select('name author price')
  } catch(error) {
    console.log('Could not get courses ', error.message);
  }
};

const run = async () => {
  const backendCourses = await getBackendCourses();
  console.log(backendCourses);

  const frontendBackendCourses = await getFrontendBackendCourses();
  console.log(frontendBackendCourses);

  const expensiveCourses = await getExpensiveCourses();
  console.log(expensiveCourses);
};

run();
