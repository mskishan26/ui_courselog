'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashedPasswords = await Promise.all([
      bcrypt.hash('password123', 10),
      bcrypt.hash('securepass456', 10),
      bcrypt.hash('volunteerpass789', 10)
    ]);

    return queryInterface.bulkInsert('volunteer', [
      {
        volunteer_id: 'V001',
        phone_num: '9876543210',
        vol_name: 'john doe',
        password: hashedPasswords[0],
        role: 'V1'
      },
      {
        volunteer_id: 'V002',
        phone_num: '9876543211',
        vol_name: 'john bin',
        password: hashedPasswords[1],
        role: 'V2'
      },
      {
        volunteer_id: 'V003',
        phone_num: '9877543210',
        vol_name: 'john son',
        password: hashedPasswords[2],
        role: 'V3'
      }
    ], {});
  
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('volunteer', null, {});
  }
};