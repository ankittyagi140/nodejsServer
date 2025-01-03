import { body } from 'express-validator';

export const registerValidation = () => {
    return [
        body('name')
            .notEmpty().withMessage('Name is required')
            .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
        // Validate 'email'
        body('email')
            .isEmail().withMessage('Enter a valid email'),
        // Validate 'password'
        body('password')
            .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
            .matches(/\d/).withMessage('Password must contain at least one number')
            .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter'),
    ]
}