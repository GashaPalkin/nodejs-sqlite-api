const { body } = require('express-validator');
const registerValidator = [
  body('name', 'Укажите имя. Не менее 3 символов').isLength({ min: 3 }),
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
]

module.exports = registerValidator