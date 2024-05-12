import { body } from 'express-validator'

export const loginValidation = [
    body('email', 'невеный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
];

export const registerValidation = [
    body('email', 'невеный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
    body('name', 'Укажите имя').isLength({ min: 2 }),
    body('lastname', 'Укажите фамилию').isLength({ min: 3 }),
    body('phone', 'Укажите номер').isLength({ min: 3 }),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isString(),

];

export const ProductsCreateValidation = [
    body('name', 'vvedite nazvanie tovatra').isLength({ min: 3 }).isString(),
    body('description', 'vvedite opisanie tovara').isLength({ min: 3 }).isString(),
    body('isInStock', 'vvedite cenu').isBoolean(),
    body('price', 'vvedite cenu').isNumeric(),
    body('category', 'neverni format tegov').optional().isString(),
    body('brandName', 'neverni format tegov').optional().isString(),
    body('reviews', 'neverni format tegov').optional().isArray(),
    body('availableSizes', 'neverni format tegov').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на kartinku').optional().isString(),
    body('additionalImageUrls', 'Неверная ссылка на kartinku').optional().isArray(),
    body('additionalImageUrls', 'Неверная ссылка на kartinku').optional().isArray(),


];