const express = require("express");
const axios = require("axios"); //Klient HTTP do komunikacji z innymi serwisami
const { sequelize, Order } = require("./order.model");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3002;

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
  console.log("Orders Database is ok");
});

//Endpointy

//Get
app.get("/api/orders/:userId", async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.params.userId },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Post
app.post("/api/orders", authenticateToken, async (req, res) => {
  try {
    const { userId, bookId, quantity } = req.body;

    try {
      await axios.get(`http://127.0.0.1:3001/api/books/${bookId}`);
    } catch (error) {
      return res.status(404).json({ error: "Book does not exist" });
    }

    const newOrder = await Order.create({ userId, bookId, quantity });
    res
      .status(201)
      .json({ id: newOrder.id, message: "Order created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Delete
app.delete("/api/orders/:orderId", authenticateToken, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    await order.destroy();
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Patch
app.patch("/api/orders/:orderId", authenticateToken, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    await order.update(req.body);
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Serwer
app.listen(PORT, () => {
  console.log(`Orders service is running on ${PORT}`);
});
