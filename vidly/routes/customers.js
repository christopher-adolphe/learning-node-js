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
    const selectedCustomer = await Customer
      .findById(request.params.id)
      .select('_id name phone isGold');

    if (!selectedCustomer) {
      return response.status(404).send(`Sorry, we could not find customer with id ${request.params.id}.`);
    }

    response.send(selectedCustomer);
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while fetching customer with id ${request.params.id}: ${exception.message}`);
  }
});

// Defining a route to handle http POST request to add a new customer
router.post('/', async (request, response) => {
  const { error } = validate(request.body);

  if (error) {
    return response.status(400).send(`Sorry, we could not add new customer because ${error.message}.`);
  }

  try {
    const newCustomer = new Customer({ ...request.body });

    await newCustomer.save();

    response.status(201).send(newCustomer);
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while creating new customer: ${exception.message}`);
  }
});

// Defining a route to handle http PUT request to update a customer
router.put('/:id', async (request, response) => {
  const { error } = validate(request.body);

  if (error) {
    return response.status(400).send(`Sorry, we could not update customer with id ${request.params.id} because ${error.message}.`);
  }

  try {
    const customer = await Customer.findByIdAndUpdate(request.params.id, { ...request.body }, { new: true });

    if (!customer) {
      return response.status(404).send(`Sorry, we could not find customer with id ${request.params.id} to perform update.`);
    }

    customer.set({ ...request.body });

    const result = await customer.save();

    response.send(result);
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while updating customer with id ${request.params.id}: ${exception.message}`);
  }
});

// Defining a route to handle http DELETE request to delete a customer
router.delete('/:id', async (request, response) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(request.params.id);

    if (!deletedCustomer) {
      return response.status(404).send(`Sorry, we could not find customer with id ${request.params.id} to perform delete.`);
    }

    response.send(deletedCustomer);
  } catch (exception) {
    response.status(500).send(`Sorry, an error occured while deleting customer with id ${request.params.id}: ${exception.message}`);
  }
});

module.exports = router;
