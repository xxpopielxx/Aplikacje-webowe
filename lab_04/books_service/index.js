const express = require("express");
const { sequelize, Book } = require("./book.model");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3001;

app.use(express.json());

//Weryfikacja tokenu
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  //Weryfikacja kluczem
  jwt.verify(token, "tajny_klucz_do_jwt", (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

//Baza danych
sequelize.sync().then(() => {
  console.log("Books Database is ok");
});

//Endpointy

//Get
app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Get konkretną książkę
app.get("/api/books/:id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Post
app.post("/api/books", authenticateToken, async (req, res) => {
  try {
    const { title, author, year } = req.body;
    //Nowa książka
    const newBook = await Book.create({ title, author, year });
    res
      .status(201)
      .json({ id: newBook.id, message: "Book created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Delete
app.delete("/api/books/:bookId", authenticateToken, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    await book.destroy();
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Serwer
app.listen(PORT, () => {
  console.log(`Books service is running on ${PORT}`);
});
