const { getRepository,getConnection } = require('typeorm');
const Sale = require('../entity/Sale');
const SaleItem = require('../entity/SaleItem');
const Product = require('../entity/Product')
const { format } = require('date-fns');

exports.getAllSales = async (req, res) => {
  try {
    const saleRepository = getRepository(Sale);
    const sales = await saleRepository.find({
      relations: ['products'] // Include the related products
    });
    
    const date = new Date()
    // Map the sales data to include product details if needed
    const salesWithDetails = sales.map(sale => ({
      id: sale.id,
    saleCustomer: sale.customerName,
      customerEmail: sale.customerEmail,
      saleQuantity: sale.quantity,
      address: sale.address,
      saleDate: format(new Date(sale.createdAt), 'dd/MM/yyyy'),
      products: sale.products.map(product => ({
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        image: product.image
      }))
    }));

    res.json(salesWithDetails);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.searchSales = async (req, res) => {
  const { saleDate:date, saleCustomer:customerName, saleQuantity:quantity, salePrice:price,saleProduct:productName } = req.body;

  try {
    const saleRepository = getRepository(Sale);
    
    // Build the query builder with dynamic filters
    let queryBuilder = saleRepository.createQueryBuilder('sale')
      .leftJoinAndSelect('sale.products', 'product'); // Ensure products are joined
    console.log(req.body)
    // Apply filters based on the provided query parameters
    if (date) {
      queryBuilder = queryBuilder.andWhere('DATE(sale.createdAt) = :date', { date });
    }
    if (customerName) {
      queryBuilder = queryBuilder.andWhere('sale.customerName LIKE :customerName', { customerName: `%${customerName}%` });
    }
    if (quantity) {
      queryBuilder = queryBuilder.andWhere('sale.quantity = :quantity', { quantity });
    }
    if (price) {
      queryBuilder = queryBuilder.andWhere('product.price = :price', { price });
    }
    if (productName){
      queryBuilder = queryBuilder.andWhere('product.id = :productName', { productName });
    }

    // Execute the query
    console.log(productName)
    const sales = await queryBuilder.getMany();
    if (sales.length === 0) {
      return res.status(404).json({ message: 'No results found' });
    }

    // Format the sales data
    const salesWithDetails = sales.map(sale => ({
      id: sale.id,
      saleCustomer: sale.customerName,
      customerEmail: sale.customerEmail,
      saleQuantity: sale.quantity,
      address: sale.address,
      saleDate: format(new Date(sale.createdAt), 'dd/MM/yyyy'), // Format the date as DD/MM/YYYY
      products: sale.products.map(product => ({
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
        image: product.image
      }))
    }));

    res.json(salesWithDetails);
  } catch (error) {
    console.error('Error searching sales:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const saleRepository = getRepository(Sale);
    const sale = await saleRepository.findOne(req.params.id, { relations: ['saleItems', 'saleItems.product', 'customer'] });
    if (sale) {
      res.json(sale);
    } else {
      res.status(404).json({ error: 'Sale not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.createSale = async (req, res) => {
  const { customerName, customerEmail, quantity, address, productId } = req.body;
  console.log(customerName)

  // Validate request data
  if (!customerName || !customerEmail || !quantity || !address || !productId) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const saleRepository = getRepository(Sale);
  const productRepository = getRepository(Product);

  try {
    // Fetch the product from the database
    const product = await productRepository.find({ where: { id: [productId] } });

    if (!product) {
      return res.status(404).json({ error: 'Product does not exist' });
    }

    // Check if there is enough quantity in stock
    if (product[0].quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient product quantity' });
    }

    // Create the sale entity
    const sale = saleRepository.create({
      customerName,
      customerEmail,
      quantity,
      address,
      products: product // Associate the product with the sale
    });

    // Save the sale entity
    await saleRepository.save(sale);

    // Reduce the product quantity
    product[0].quantity -= quantity;
    
    await productRepository.save(product[0]);

    res.status(201).json({ message: 'Sale created successfully' });
  } catch (error) {
    console.error('Error creating sale:', error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.getSalesByProductId = async (req, res) => {
  try {
    const saleRepository = getRepository(Sale);
    const sales = await saleRepository.createQueryBuilder('sale')
      .leftJoinAndSelect('sale.saleItems', 'saleItem')
      .leftJoinAndSelect('saleItem.product', 'product')
      .where('product.id = :productId', { productId: req.params.productId })
      .getMany();

    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getSalesByCustomerId = async (req, res) => {
  try {
    const saleRepository = getRepository(Sale);
    const sales = await saleRepository.find({ where: { customer: { id: req.params.customerId } }, relations: ['saleItems', 'saleItems.product'] });
    
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteSale = async (req, res) => {
  try {
    const saleRepository = getRepository(Sale);
    
    // Find the sale by ID
    const sale = await saleRepository.findOne({where:{id:req.params.id}}, { relations: ['products'] });
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    
    // Delete the sale
    const result = await saleRepository.remove(sale);
    if (result) {
      res.status(204).end(); // No content, successful deletion
    } else {
      res.status(500).json({ error: 'Failed to delete sale' });
    }
  } catch (error) {
    console.error('Error deleting sale:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.updateSale = async (req, res) => {
  console.log(req.body)
  const { saleCustomer: customerName, saleQuantity: quantity, saleProduct } = req.body;

  // Validate request data
  if (!customerName && quantity === undefined && !saleProduct) {
    return res.status(400).json({ error: 'At least one field (customerName, quantity, saleProduct) is required to update' });
  }

  try {
    const saleRepository = getRepository(Sale);
    const productRepository = getRepository(Product);

    // Find the sale by ID
    const sale = await saleRepository.findOne({ where: { id: req.params.id } }, { relations: ['products'] });
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    // Initialize products as an empty array if it's undefined
    if (!sale.products) {
      sale.products = [];
    }

    // Update customer name if provided
    if (customerName) {
      sale.customerName = customerName;
    }

    // Handle quantity and product update
    if (quantity !== undefined || saleProduct) {
      // If updating quantity, add the old product quantities back to stock
      for (const saleProduct of sale.products) {
        const product = await productRepository.findOne({ where: { id: saleProduct.id } });
        if (product) {
          product.quantity += saleProduct.quantity; // Add back the quantity to stock
          await productRepository.save(product); // Save the updated product stock
        }
      }

      // Clear the existing products
      sale.products = [];

      // If a new product is provided, add it to the sale
      if (saleProduct) {
        const newProduct = await productRepository.findOne({ where: { id: saleProduct } });
        if (!newProduct) {
          return res.status(404).json({ error: 'Product does not exist' });
        }

        // Reduce the product quantity
        newProduct.quantity -= quantity;
        await productRepository.save(newProduct); // Save the updated new product

        // Add the new product to the sale
        sale.products.push(newProduct);
        sale.quantity = quantity;
      }
    }

    // Save the up
    await saleRepository.save(sale);

    res.json(sale);
  } catch (error) {
    console.error('Error updating sale:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

