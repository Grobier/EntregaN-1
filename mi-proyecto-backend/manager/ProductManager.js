const fs = require('fs');
const path = require('path');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    // Si el archivo no existe, se crea con un arreglo vacío.
    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, JSON.stringify([]));
    }
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error al leer los productos:', error);
      return [];
    }
  }

  async addProduct(product) {
    try {
      const products = await this.getProducts();
      // Generar un id autoincremental.
      const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
      const newProduct = { id: newId, ...product };
      products.push(newProduct);
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return newProduct;
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  }

  async getProductById(pid) {
    try {
      const products = await this.getProducts();
      return products.find(prod => prod.id === parseInt(pid));
    } catch (error) {
      console.error('Error al obtener producto:', error);
    }
  }

  async updateProduct(pid, updatedFields) {
    try {
      const products = await this.getProducts();
      const index = products.findIndex(prod => prod.id === parseInt(pid));
      if (index === -1) return null;
      // Evitar modificar el id.
      if(updatedFields.id) delete updatedFields.id;
      products[index] = { ...products[index], ...updatedFields };
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return products[index];
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  }

  async deleteProduct(pid) {
    try {
      const products = await this.getProducts();
      const newProducts = products.filter(prod => prod.id !== parseInt(pid));
      await fs.promises.writeFile(this.path, JSON.stringify(newProducts, null, 2));
      return true;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return false;
    }
  }
}

module.exports = ProductManager;
