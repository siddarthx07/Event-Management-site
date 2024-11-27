'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Events', 'image', {
      type: Sequelize.STRING,
      allowNull: true, // Adjust as needed for your use case
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Events', 'image');
  },
};
