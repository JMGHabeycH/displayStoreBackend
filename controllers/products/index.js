const productSchema = require('./schema');
const Product = require("../../models/product");

const createProduct = async (req, res, next) => {
    console.log(req.file);
    try {
        const imageData = {
          data: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
          contentType: req.file.mimetype
        }
      

        const productData = {
        ...req.body,
        image: imageData
        };

        const newProduct = new Product(productData);
        const productCreated = await newProduct.save();

        res.json({
        message: `Product created successfully with id="${productCreated.id}"`,
            product: {
                id: productCreated.id,
                name: productCreated.name,
                imageStored: Boolean(productCreated.image?.data),
            }
        }) ;
    }
    catch (e) {
        res.json({
            error: e.message,
        })
    }
}

const getProductById = async (req, res,next) => {
    console.log(req.params)
    const product = await Product.findById(req.params.productId)
    res.json(product);
}

const getProductsWithFilter = async (req, res,next) => {
    try {
        const { q } = req.query;
        // If no query specified, return all products
        if (!q) {
          const allProducts = await Product.find();
          return res.json(allProducts);
        }
    
        const orConditions = [];
    
        // Text search (case-insensitive) across string fields
        ['name', 'short_description', 'description', 'category'].forEach(field => {
          orConditions.push({ [field]: { $regex: q, $options: 'i' } });
        });
    
        // Numeric exact-match if q is a number
        const qNumber = Number(q);
        if (!isNaN(qNumber)) {
          ['price', 'stock', 'rating'].forEach(field => {
            orConditions.push({ [field]: qNumber });
          });
        }
        console.log(orConditions);
        const products = await Product.find({ $or: orConditions });
        const mappedProducts = products.map(product => {
            return {
                id: product._id.toString(),
                name: product.name,
                price: product.price,
                image: product.image,
                shortDescription: product.short_description,
                stock: product.stock,
                decription: product.description,
                rating: product.rating,
                usersRating: product.users_rating
            }
        })
        res.json(mappedProducts);
      } catch (e) {
        next(e);
      }
}

const rateProduct = async (req, res,next) => {
    const {rate} = req.body;
    if(!rate && rate < 5) {
        return res.status(400).json({
            message: `Asigna un valor`,
        })
    }
    try {
        // TODO: consultar el producto
        const product = await Product.findById(req.params.productId)
        // aumenta usuario que han recomendado el producto
        product.users_rating = product.users_rating + 1;
        // calculo el nuevo rate
        if(!product.users_rating) {
            product.rating = product.rating + rate;
        } else {
            product.rating = (product.rating + rate) / 2;
        }
        // guardar el producto
        product.save()

        res.json({
            message: `Product rated successfully`,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
        })
    }
}



module.exports = {createProduct, getProductById, getProductsWithFilter, rateProduct};


