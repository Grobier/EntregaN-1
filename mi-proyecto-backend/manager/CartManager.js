const fs = require('fs');

class CartManager {
  constructor(filePath) {
    this.path = filePath;
    // Si el archivo no existe, se crea con un arreglo vacío.
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
    }
  }

  async getCarts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al leer los carritos:', error);
      return [];
    }
  }

  async createCart() {
    try {
      const carts = await this.getCarts();
      const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
      const newCart = {
        id: newId,
        products: [] // Inicialmente vacío.
      };
      carts.push(newCart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
      return newCart;
    } catch (error) {
      console.error('Error al crear carrito:', error);
    }
  }

  async getCartById(cid) {
    try {
      const carts = await this.getCarts();
      return carts.find(cart => cart.id === parseInt(cid));
    } catch (error) {
      console.error('Error al obtener carrito:', error);
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex(cart => cart.id === parseInt(cid));
      if (cartIndex === -1) return null;
      let cart = carts[cartIndex];
      // Si el producto ya existe en el carrito, incrementar quantity.
      const productInCart = cart.products.find(p => p.product === parseInt(pid));
      if (productInCart) {
        productInCart.quantity += 1;
      } else {
        cart.products.push({ product: parseInt(pid), quantity: 1 });
      }
      carts[cartIndex] = cart;
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
      return cart;
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
    }
  }
}

module.exports = CartManager;
