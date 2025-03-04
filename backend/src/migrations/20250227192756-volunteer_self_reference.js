'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('Volunteers', {
      fields: ['reporting_leader'],
      type: 'foreign key',
      name: 'fk_volunteer_reporting_leader',
      references: {
        table: 'Volunteers',
        field: 'volunteer_id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Volunteers', 'fk_volunteer_reporting_leader');
  }
};

