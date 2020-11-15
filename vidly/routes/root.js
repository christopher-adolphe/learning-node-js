const express = require('express');
const router = express.Router();

// Defining the root route of the application
router.get('/', (request, response) => {
  response.send('Vidly App running...');
});

module.exports = router;
