const express = require('express');
const Sequelize = require('sequelize');
const app = express();

app.use(express.json()); // ใช้ middleware สำหรับ JSON request

// สร้างการเชื่อมต่อฐานข้อมูล SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './Database/Books.sqlite',
});

// กำหนด Model สำหรับตารางหนังสือ
const Book = sequelize.define('Book', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  author: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// สร้างตารางถ้ายังไม่มี
sequelize.sync()
  .then(() => console.log('Database & tables created!'))
  .catch(err => console.error('Error syncing database:', err));

// ดึงข้อมูลหนังสือทั้งหมด
app.get('/books', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (err) {
    res.status(500).send(err);
  }
});

// ดึงข้อมูลหนังสือตาม ID
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).send('Book not found');
    }
    res.json(book);
  } catch (err) {
    res.status(500).send(err);
  }
});

// เพิ่มหนังสือใหม่
app.post('/books', async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.json(book);
  } catch (err) {
    res.status(500).send(err);
  }
});

// อัปเดตข้อมูลหนังสือตาม ID
app.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).send('Book not found');
    }
    await book.update(req.body);
    res.json(book);
  } catch (err) {
    res.status(500).send(err);
  }
});

// ลบหนังสือตาม ID
app.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).send('Book not found');
    }
    await book.destroy();
    res.send({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});

// เริ่มเซิร์ฟเวอร์
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
