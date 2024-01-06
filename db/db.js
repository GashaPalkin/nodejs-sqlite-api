const sqlite3 = require('sqlite3').verbose();

// DB connection
let db = new sqlite3.Database('./db/database.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the database.');
});

// DB create tables 
// db.run(`CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY AUTOINCREMENT, title, content, image)`)
// db.run(`CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, name, email, password)`)

// DB insert data 
// db.run(`INSERT INTO posts (title, content, image) VALUES (?,?,?)`, ['Another Post', 'Content Another Post', "image"])

// DB update data 
// db.run(`UPDATE posts set title = ?, content = ?, image = ?  where id = ?`,['Another Post', 'Content Another Post', "image", 5])

// DB delete data 
// db.run(`DELETE FROM posts WHERE ID=?`, [5])

// DB drop table
// db.run(`DROP TABLE users`)

// DB get data
// db.serialize(() => {
//   db.each(`SELECT * FROM posts`, (err, row) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log(row);
//   });
// });

// DB close
// db.close((err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Close the database connection.');
// });

module.exports = db