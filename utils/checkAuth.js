const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
  if (token) {
    try {
      const decoded = jwt.verify(token, 'secret_password')
      req.email = decoded.email
      // res.json(decoded);  //
      next()
    } catch (error) {
      res.json({ message: 'Нет доступа.Неверный токен!' });
    }
  } else {
    res.json({ message: 'Нет доступа. Нет токена!' });
  }
}

module.exports = checkAuth