const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Your Sequelize setup

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true  
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },  
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'regular' // Default role is 'regular'
  }
});

module.exports = User;
