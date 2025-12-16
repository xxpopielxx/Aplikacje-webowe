const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./users.db",
  logging: false,
});

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, //Email nie może się powtarzać
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false, //Hash hasła tutaj
  },
});

module.exports = { sequelize, User };
