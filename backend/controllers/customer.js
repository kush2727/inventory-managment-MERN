const { getRepository } = require('typeorm');
const Customer = require('../entity/Customer');

exports.getAllCustomers = async (req, res) => {
  try {
    const customerRepository = getRepository(Customer);
    const customers = await customerRepository.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customerRepository = getRepository(Customer);
    const customer = await customerRepository.findOne(req.params.id);
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const customerRepository = getRepository(Customer);
    const customer = customerRepository.create(req.body);
    await customerRepository.save(customer);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
};

exports.updateCustomerById = async (req, res) => {
  try {
    const customerRepository = getRepository(Customer);
    const customer = await customerRepository.findOne(req.params.id);
    if (customer) {
      customerRepository.merge(customer, req.body);
      await customerRepository.save(customer);
      res.json(customer);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
};

exports.deleteCustomerById = async (req, res) => {
  try {
    const customerRepository = getRepository(Customer);
    const result = await customerRepository.delete(req.params.id);
    if (result.affected > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
