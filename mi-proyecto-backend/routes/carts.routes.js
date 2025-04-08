const express = require('express');
const router = express.Router();
const CartManager = require('../manager/CartManager');

const cartManager = new CartManager('./data/carts.json');

// POST /: Crear un nuevo carrito.
router.post('/', async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear carrito' });
  }
});

// GET /:cid: Listar los productos del carrito.
router.get('/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart.products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
});

// POST /:cid/product/:pid: Agregar producto al carrito.
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    if (!updatedCart) {
      return res.status(404).json({ error: 'Carrito o producto no encontrado' });
    }
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
});

module.exports = router;
