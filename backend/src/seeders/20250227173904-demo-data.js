'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add Centers
    await queryInterface.bulkInsert('Centers', [
      { 
        center_id: 'CTR001', 
        name: 'Downtown Learning Center', 
        address: '123 Main St, City', 
        point_of_contact: 'John Smith', 
        phone_num: '1234567890',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        center_id: 'CTR002', 
        name: 'Westside Education Hub', 
        address: '456 Park Ave, City', 
        point_of_contact: 'Mary Johnson', 
        phone_num: '2345678901',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    // Add Classes
    await queryInterface.bulkInsert('Classes', [
      { 
        class_id: 'CLS001', 
        subject: 'Mathematics', 
        center_id: 'CTR001', 
        day: 'Monday', 
        time: '14:00:00',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        class_id: 'CLS002', 
        subject: 'Science', 
        center_id: 'CTR001', 
        day: 'Wednesday', 
        time: '15:30:00',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        class_id: 'CLS003', 
        subject: 'English', 
        center_id: 'CTR002', 
        day: 'Tuesday', 
        time: '16:00:00',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    // Add Students
    await queryInterface.bulkInsert('Students', [
      { 
        student_id: 'STD001', 
        student_grade: 5, 
        student_name: 'Alice Brown', 
        center_id: 'CTR001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        student_id: 'STD002', 
        student_grade: 6, 
        student_name: 'Bob Wilson', 
        center_id: 'CTR001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        student_id: 'STD003', 
        student_grade: 4, 
        student_name: 'Carol Davis', 
        center_id: 'CTR002',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    // Add Volunteers
    await queryInterface.bulkInsert('Volunteers', [
      { 
        volunteer_id: 'volunteer1@example.com', 
        phone_num: '3456789012', 
        reporting_leader: 'leader@example.com', 
        volunteer_name: 'David Miller', 
        center_id: 'CTR001', 
        class_id: 'CLS001', 
        volunteer_role: 'L1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        volunteer_id: 'volunteer2@example.com', 
        phone_num: '4567890123', 
        reporting_leader: 'leader@example.com', 
        volunteer_name: 'Emma Clark', 
        center_id: 'CTR001', 
        class_id: 'CLS002', 
        volunteer_role: 'L2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        volunteer_id: 'volunteer3@example.com', 
        phone_num: '5678901234', 
        reporting_leader: 'leader@example.com', 
        volunteer_name: 'Frank Jones', 
        center_id: 'CTR002', 
        class_id: 'CLS003', 
        volunteer_role: 'L3',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
    
    // Create Student-Class Mappings
    await queryInterface.bulkInsert('StudentClassMappings', [
      { 
        student_class_mapping_id: Sequelize.literal('gen_random_uuid()'), 
        student_id: 'STD001', 
        class_id: 'CLS001', 
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        student_class_mapping_id: Sequelize.literal('gen_random_uuid()'), 
        student_id: 'STD002', 
        class_id: 'CLS001', 
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        student_class_mapping_id: Sequelize.literal('gen_random_uuid()'), 
        student_id: 'STD003', 
        class_id: 'CLS003', 
        is_active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    // Remove data in reverse order to avoid foreign key constraints
    await queryInterface.bulkDelete('StudentClassMappings', null, {});
    await queryInterface.bulkDelete('Volunteers', null, {});
    await queryInterface.bulkDelete('Students', null, {});
    await queryInterface.bulkDelete('Classes', null, {});
    await queryInterface.bulkDelete('Centers', null, {});
  }
};
