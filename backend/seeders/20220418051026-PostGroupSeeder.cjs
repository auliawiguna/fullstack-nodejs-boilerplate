'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('post_groups', [
      {
        name: 'Kesehatan',
        post_id: '1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Gaya Hidup',
        post_id: '1',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Politik',
        post_id: '1',
        created_at: new Date(),
        updated_at: new Date()
      },
  ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
