const db = require('../db/db.js');

class PostController {
  createPost(req, res) {
    const sql = `INSERT INTO posts (title, content, image) VALUES (?,?,?)`
    // взяли данные из запроса клиента
    const { title, content, image } = req.body
    // положили данные в параметры SQL запроса
    const params = [title, content, image]
    db.run(sql, params, function (err) {
      if (err) {
        res.status(400).json({ "error": err.message })
        return;
      }
      res.json({
        "message": "success",
        "data": {
          "title": title,
          "content": content,
          "image": image
        },
        "id": this.lastID
      })
    })
  }

  getPosts(req, res) {
    const sql = `SELECT * FROM posts`
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

  getOnePost(req, res) {
    const sql = `SELECT * FROM posts WHERE id=?`
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

  updatePost(req, res) {
    const { title, content, image } = req.body
    const sql = `UPDATE posts set title = ?, content = ?, image = ?  where id = ?`
    const id = req.params.id
    let params = [title, content, image, id]
    db.run(sql, params, function (err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Row(s) updated: ${this.changes}`);
      res.json({
        message: "success",
        "data": {
          "title": title,
          "content": content,
          "image": image
        },
        changes: this.changes
      })
    });
  }

  deletePost(req, res) {
    const sql = `DELETE FROM posts WHERE id=?`
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

module.exports = new PostController()