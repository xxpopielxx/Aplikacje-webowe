const express = require("express");
const bcrypt = require("bcryptjs"); //Hashowanie haseł
const jwt = require("jsonwebtoken"); //Do tworzenia tokenów
const { sequelize, User } = require("./user.model");

const app = express();
const PORT = 3003;

//SECRET_KEY
const SECRET_KEY = "tajny_klucz_do_jwt";

app.use(express.json());

//Baza danych
sequelize.sync().then(() => {
  console.log("Users Database is ok");
});

//Endpointy

//Post (rejestracja)
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    //Czy user już istnieje
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    //Hashowanie hasła
    const hashedPassword = await bcrypt.hash(password, 10);

    //Tworzenie usera
    const newUser = await User.create({ email, password: hashedPassword });

    res
      .status(201)
      .json({ id: newUser.id, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Post (logowanie)
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //Znajdź usera
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    //Sprawdź hasło
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    //Generacja tokenu
    const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    //Token do klienta
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Serwer
app.listen(PORT, () => {
  console.log(`Users service is running on ${PORT}`);
});
