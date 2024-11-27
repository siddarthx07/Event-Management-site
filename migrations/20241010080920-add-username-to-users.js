module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Add the column without the UNIQUE constraint
    await queryInterface.addColumn('Users', 'username', {
      type: Sequelize.STRING,
      allowNull: true,  // Set to true for now
    });

    // Step 2: Update existing rows with a unique username (use the email or any logic)
    await queryInterface.sequelize.query(
      'UPDATE Users SET username = email WHERE username IS NULL;'
    );

    // Step 3: Change the column to be unique
    await queryInterface.changeColumn('Users', 'username', {
      type: Sequelize.STRING,
      allowNull: false,  // Now set to false, because every user must have a username
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'username');
  }
};
