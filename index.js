const express = require('express');
const multer = require('multer');
const cors = require("cors");
const userRouter = require('./routes/user.routes')
const postRouter = require('./routes/post.routes')
const PORT = process.env.PORT || 4444
const app = express()
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage })
app.use(express.json())
app.use(cors());
app.use('/uploads', express.static('uploads'))
// загрузка изображения
app.post('/uploads', upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  })
})
// остальные роуты
app.use('/api', userRouter, postRouter)
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
