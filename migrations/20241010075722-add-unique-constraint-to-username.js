'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'username', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true // Add UNIQUE constraint now
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'username', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false
    });
  }
};
