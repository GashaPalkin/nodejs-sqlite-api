const db = require('../db/db.js');

const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class UserController {

  async registerUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    const sqlCheckUserExist = `SELECT * FROM users WHERE email = ?`
    const sqlRegisterUser = `INSERT INTO users (name, email, password) VALUES (?,?,?)`
    // берем данные из запроса клиента
    const { name, email, password } = req.body
    // шифруем
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    // кладем данные в параметры SQL запроса sqlRegisterUser
    const params = [name, email, passwordHash]
    const token = jwt.sign({ email: req.body.email }, 'secret_password', { expiresIn: '1d' })
    // проверка существует ли уже такой пользователь
    db.all(sqlCheckUserExist, email, (err, result) => {
      if (err) {
        res.status(402).json({ "error": err.message });
        return;
      }
      if (result.length === 0) {
        // регистрация нового пользователя
        db.run(sqlRegisterUser, params, (err) => {
          if (err) {
            res.status(400).json({ "error": err.message })
            return;
          }
          res.json({
            "message": "success",
            "data": {
              "name": name,
              "email": email,
              "passwordHash": passwordHash
            },
            "token": token
          })
        })
      } else {
        res.json({
          "message": 'Пользователь с таким email уже существует',
        })
      }
    })
  }

  async loginUser(req, res) {
    // берем данные из запроса клиента
    const { email } = req.body
    const sqlCheckUserExist = `SELECT * FROM users WHERE email = ?`
    db.all(sqlCheckUserExist, email, async (err, result) => {
      // если есть такой пользователь
      if (!result.length == 0) {
        const { name, password } = result[0]
        const isValidPassword = await bcrypt.compare(req.body.password, password)
        if (!isValidPassword) {
          return res.status(400).json({
            "message": 'Неверный пароль',
          })
        } else {
          // создаем новый токен
          const token = jwt.sign({ email: req.body.email }, 'secret_password', { expiresIn: '1d' })
          res.json({
            "message": 'Ок',
            "data": {
              "name": name,
              "email": email,
            },
            "token": token
          })
        }
        // если нет такого пользователя
      } else {
        return res.status(400).json({
          "message": 'Неверный email',
        })
      }
    })
  }

  async getMeUser(req, res) {
    // выполняется если прошла проверка на токен в checkAuth.js
    try {
      const { email } = req.body
      const sqlCheckUserExist = `SELECT * FROM users WHERE email = ?`
      db.all(sqlCheckUserExist, email, async (err, result) => {
        // если есть такой пользователь
        if (!result.length == 0) {
          const { name, id } = result[0]
          res.json({
            "message": 'Ок',
            "data": {
              "id": id,
              "name": name,
              "email": email
            }
          })
        } else {
          return res.status(400).json({
            "message": 'Пользователь не найден',
          })
        }
      })
      // выполняется если не прошла проверка на токен в checkAuth.js
    } catch (error) {
      res.json({ message: 'Нет доступа' });
    }
  }

  async getUsers(req, res) {
    const sql = `SELECT * FROM users`
    db.all(sql, (err, rows) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({
        "message": "success",
        "data": rows
      })
    });
  }

  async getOneUser(req, res) {
    const sql = `SELECT * FROM users WHERE id=?`
    const id = req.params.id
    db.all(sql, id, (err, rows) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({
        "message": "success",
        "data": rows
      })
    });
  }

  async updateUser(req, res) {
    const { name, email, password } = req.body
    const sql = `UPDATE users set name = ?, email = ?, password = ?  where id = ?`
    const id = req.params.id
    let params = [name, email, password, id]
    db.run(sql, params, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Row(s) updated: ${this.changes}`);
      res.json({
        message: "success",
        "data": {
          "name": name,
          "email": email,
          "password": password
        },
        changes: this.changes
      })
    });
  }

  async deleteUser(req, res) {
    const sql = `DELETE FROM users WHERE id=?`
    const id = req.params.id
    db.run(sql, id, (err) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({ "message": "Deleted" })
    })
  }
}

module.exports = new UserController()