const { Sequelize } = require('sequelize');

// SQLite database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',  // Use the correct in-memory SQLite format
  logging: false
});

module.exports = sequelize;
