import { body, validationResult } from 'express-validator';

// Middleware to catch validation errors
export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  };
};

// Example: Add Partner Validation
export const validateAddPartner = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().isMobilePhone().withMessage('Valid phone required'),
  body('commission').optional().isNumeric().withMessage('Commission must be a number'),
];

// Example: Create Order Validation
export const validateCreateOrder = [
  body('customerName').notEmpty().withMessage('Customer name required'),
  body('pickupAddress').notEmpty().withMessage('Pickup address required'),
  body('dropoffAddress').notEmpty().withMessage('Dropoff address required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
];
