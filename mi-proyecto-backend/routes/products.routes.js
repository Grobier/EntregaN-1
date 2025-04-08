const express = require('express');
const router = express.Router();
const ProductManager = require('../manager/ProductManager');

const productManager = new ProductManager('./data/products.json');

// GET /: Listar todos los productos.
router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// GET /:pid: Obtener un producto por su id.
router.get('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// POST /: Agregar un nuevo producto.
router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    // Validación básica de campos obligatorios.
    if (!title || !description || !code || !price || !stock || !category) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const newProduct = {
      title,
      description,
      code,
      price,
      status: status !== undefined ? status : true,
      stock,
      category,
      thumbnails: thumbnails || []
    };
    const product = await productManager.addProduct(newProduct);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// PUT /:pid: Actualizar producto (sin modificar el id).
router.put('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    const updatedFields = req.body;
    if (updatedFields.id) delete updatedFields.id; // Evitar modificar el id.
    const updatedProduct = await productManager.updateProduct(pid, updatedFields);
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Producto no encontrado para actualizar' });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// DELETE /:pid: Eliminar producto por su id.
router.delete('/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    const result = await productManager.deleteProduct(pid);
    if (result) {
      res.json({ message: 'Producto eliminado' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

module.exports = router;
