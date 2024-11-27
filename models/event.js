const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');  // Your Sequelize setup

const Event = sequelize.define('Event', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,  // Path or URL of the image
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,  // Add userId to associate the event with a user
    allowNull: false,
  }
});

module.exports = Event;
