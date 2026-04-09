const productRepository = require('../repositories/productRepository');

class ProductService {
  async getAllProducts() {
    return await productRepository.getAll();
  }

  async getProductById(id) {
    const product = await productRepository.getById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async getActiveProducts() {
    return await productRepository.getActiveProducts();
  }

  async addProduct(productData, imageUrl) {
    const productWithImage = {
      ...productData,
      image: imageUrl || null
    };

    return await productRepository.create(productWithImage);
  }

  async updateProduct(productId, productData, imageUrl) {
    // Check if product exists
    const existingProduct = await productRepository.getById(productId);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    const updateData = {
      ...productData,
      image: imageUrl || productData.image
    };

    return await productRepository.update(productId, updateData);
  }

  async deleteProduct(productId) {
    // Check if product exists
    const existingProduct = await productRepository.getById(productId);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    return await productRepository.delete(productId);
  }

  async getPriceById(productId) {
    const price = await productRepository.getPriceById(productId);
    if (price === undefined) {
      throw new Error('Product not found');
    }
    return price;
  }
}

module.exports = new ProductService();
