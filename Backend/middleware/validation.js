const Joi = require('joi');

const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { 
            abortEarly: false,
            stripUnknown: true // Automatically remove fields not in the schema
        });
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return res.status(400).json({ error: errorMessage });
        }
        // Update req.body with the sanitized version
        req.body = value;
        next();
    };
};

const signupSchema = Joi.object({
    name: Joi.string().required().min(2).max(50),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    phone: Joi.string().optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const sellerRegisterSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required().min(10),
    city: Joi.string().required(),
    store: Joi.string().required(),
    products: Joi.string().optional()
});

const productSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    category: Joi.string().required(),
    images: Joi.array().items(Joi.string().uri()).required(),
    amount: Joi.number().required().min(0),
    unit: Joi.string().required(),
    stock: Joi.number().required().min(0),
    seller_id: Joi.string().required()
});

module.exports = {
    validateRequest,
    signupSchema,
    loginSchema,
    sellerRegisterSchema,
    productSchema
};
