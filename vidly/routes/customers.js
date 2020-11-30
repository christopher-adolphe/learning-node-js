const { Customer, validate } = require('../models/customer');
const express = require('express');
const router = express.Router();

// Defining a route to handle http GET request to get all customers
router.get('/', async (request, response) => {
  try {
    const customerList = await Customer.find()
      .sort('name')
      .select('_id name phone isGold');

    response.send(customerList);
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while fetching customers: ${exception.message}`);
  }
});

// Defining a route to handle http GET request to get a specific customer
router.get('/:id', async (request, response) => {
  try {
    const selectedCustomer = await Customer.findById(request.params.id);

    if (!selectedCustomer) {
      return response.status(404).send(`Sorry, we could not find customer with id ${request.params.id}.`);
    }

    response.send(selectedCustomer);
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while fetching customer with id ${request.params.id}: ${exception.message}`);
  }
});

module.exports = router;
