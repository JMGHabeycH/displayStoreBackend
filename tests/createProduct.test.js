const request = require('supertest');
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createProduct } = require('../controllers/products/index'); // Ajusta la ruta
const Product = require('../models/product'); // Ajusta también esta ruta

jest.mock('../models/product'); // Mock de Mongoose model

// Configura Express y multer
const app = express();
app.use(express.json());

const upload = multer({ dest: 'uploads/' });
app.post('/products', upload.single('image'), createProduct);

describe('POST /products', () => {
  it('should create a new product and return its data', async () => {
    // Simulamos un producto guardado
    Product.mockImplementation(function (data) {
      this.save = jest.fn().mockResolvedValue({
        id: '123',
        name: data.name,
        image: data.image,
      });
      return this;
    });

    const response = await request(app)
      .post('/products')
      .field('name', 'Test Product')
      .attach('image', path.join(__dirname, 'testImage.png')); // Debes tener esta imagen

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.product).toMatchObject({
      id: '123',
      name: 'Test Product',
      imageStored: true,
    });
  });
});