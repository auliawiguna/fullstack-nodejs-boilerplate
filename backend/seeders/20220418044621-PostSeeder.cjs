'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('posts', [
      {
        title: 'John Doe',
        slug: 'title-1',
        content: 'Ini artikel pertama',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'John Doe 2',
        slug: 'title-2',
        content: 'Ini artikel kedua',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'John Doe 3',
        slug: 'title-3',
        content: 'Ini artikel ketiga',
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
