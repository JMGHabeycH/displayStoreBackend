const Joi = require('joi');


const productSchema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
    short_description: Joi.string(),
    description: Joi.string().required(),
    rating: Joi.number().required(),
    //images: Joi.array().items(Joi.string())
});

module.exports = productSchema;