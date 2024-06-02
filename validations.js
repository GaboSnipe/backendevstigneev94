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

];

export const ProductsCreateValidation = [
    body('name', 'Введите название товара').isLength({ min: 3 }).isString(),
    body('description', 'Введите описание товара').isLength({ min: 3 }).isString(),
    body('isInStock', 'Введите наличие на складе').isBoolean(),
    body('productionDate', 'Введите дату производства').isISO8601(),
    body('price', 'Введите цену').isNumeric(),
    body('productCode', 'Введите код продукта').isString(),
    body('category', 'Неверный формат категории').optional().isString(),
    body('brandName', 'Неверный формат производителя').optional().isString(),
    body('availableSizes', 'Неверный формат размеров').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на картинку').optional().isString(),
    body('additionalImageUrls', 'Неверная ссылка на картинки').optional().isArray(),

];
export const OrderCreateValidation = [
    body('userId', 'vvedite nazvanie tovatra'),
    body('orderStatus', 'vvedite opisanie tovara'),
    body('cartItems', 'vvedite cenu'),
    body('formData', 'neverni format tegov'),
    body('selectedItem', 'neverni format tegov'),
];