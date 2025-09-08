const Joi = require('joi');

const listingSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  image: Joi.object({
    filename: Joi.string().required(),
    url: Joi.string().uri().required()
  }).required(),
  price: Joi.number().min(0).required(),
  location: Joi.string().min(2).required(),
  country: Joi.string().min(2).required()
});

module.exports = listingSchema;
