const { Sequelize, DataTypes } = require("sequelize");

//Konfiguracja połączenia z bazą danych
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./books.db",
  logging: false, //bez logów SQL w konsoli
});

//Schemat tabeli
//ID jest dodawane automatycznie przez sequelize
const Book = sequelize.define("Book", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

//eksport
module.exports = { sequelize, Book };
