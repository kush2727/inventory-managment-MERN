const { getRepository } = require('typeorm');
const Product = require('../entity/Product');

// Example controller functions
exports.createProduct = async (req, res) => {
  try {
    const productRepository = getRepository(Product);
    const { name, quantity, price, category } = req.body;
    
    const image = req.file ? req.file.filename : null;

    const product = productRepository.create({ name, quantity, price, category,image });
    await productRepository.save(product);
    res.status(201).json(product);
  } catch (error) {
    console.log(error.message)
    res.status(400).json({ error: 'Bad request' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const productRepository = getRepository(Product);
    const products = await productRepository.find();
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: 'Bad request' }); 
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productRepository = getRepository(Product);
    const product = await productRepository.findOne(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
};

exports.updateProductById = async (req, res) => {
  try {
    const productRepository = getRepository(Product);
    const product = await productRepository.findOneBy({id:req.params.id})
    if (product) {
      const { name, quantity, price, category } = req.body;
      product.name = name || product.name;
      product.price = price || product.price;
      product.quantity = quantity || product.quantity;
      product.category = category || product.category
      if (req.file) {
        product.image = req.file.path;
      }

      await productRepository.save(product);
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
   
    res.status(400).json({ error: 'Bad request' });
  }
};

exports.deleteProductById = async (req, res) => {
  try {
    const productRepository = getRepository(Product);
    const result = await productRepository.delete(req.params.id);
    if (result.affected > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
};
