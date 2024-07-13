const { DataTypes } = require('sequelize');

const day_type = DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
const class_type = DataTypes.ENUM('Tuitions', 'Life skills', 'Others');
const role_type = DataTypes.ENUM('V1', 'V2', 'V3', 'M');

module.exports = (sequelize) => {
// Center Model
  const Center = sequelize.define('Center', {
    center_id: {
      type: DataTypes.STRING(40),
      primaryKey: true,
    },
    center_name: DataTypes.STRING(100),
    center_address: DataTypes.STRING(500),
    center_poc: DataTypes.STRING(100),
    center_num: DataTypes.STRING(10),
  }, {
    tableName: 'center',
    timestamps: false,
  });
  
  // Classes Model
  const Classes = sequelize.define('Classes', {
    class_id: {
      type: DataTypes.STRING(40),
      primaryKey: true,
    },
    subject: DataTypes.STRING(40),
    center_id: DataTypes.STRING(40),
    day: {
      type: day_type,
      allowNull: false,
    },
    time: DataTypes.TIME,
  }, {
    tableName: 'classes',
    timestamps: false,
  });
  
  // ClassLog Model
  const ClassLog = sequelize.define('ClassLog', {
    map_id: {
      type: DataTypes.STRING(40),
      primaryKey: true,
    },
    classdate: {
      type: DataTypes.DATEONLY,
      primaryKey: true,
    },
    pre_classtype: class_type, // Replace with actual enum values
    pre_chapter: DataTypes.STRING(200),
    pre_links: DataTypes.STRING(200),
    pre_plan: DataTypes.STRING(2000),
    post_log: DataTypes.STRING(2000),
    post_library_flag: DataTypes.BOOLEAN,
    pre_screen_flag: DataTypes.INTEGER,
    post_quiz_score: DataTypes.INTEGER,
    post_comments: DataTypes.STRING(3000),
    pre_flag: DataTypes.BOOLEAN,
    post_flag: DataTypes.BOOLEAN,
    post_class_rating: DataTypes.INTEGER,
  }, {
    tableName: 'classlog',
    timestamps: false,
  });
  
  // ClassMap Model
  const ClassMap = sequelize.define('ClassMap', {
    map_id: {
      type: DataTypes.STRING(40),
      primaryKey: true,
    },
    class_id: DataTypes.STRING(40),
    student_id: DataTypes.STRING(40),
    volunteer_id: DataTypes.STRING(40),
  }, {
    tableName: 'classmap',
    timestamps: false,
  });
  
  // Student Model
  const Student = sequelize.define('Student', {
    student_id: {
      type: DataTypes.STRING(40),
      primaryKey: true,
    },
    student_grade: DataTypes.INTEGER,
    student_name: DataTypes.STRING(100),
    centre_id: DataTypes.STRING(40),
  }, {
    tableName: 'student',
    timestamps: false,
  });
  
  // Volunteer Model
  const Volunteer = sequelize.define('Volunteer', {
    volunteer_id: {
      type: DataTypes.STRING(40),
      primaryKey: true,
    },
    phone_num: DataTypes.STRING(10),
    lead: DataTypes.STRING(40),
    vol_name: DataTypes.STRING(100),
    centre_id: DataTypes.STRING(40),
    class_id: DataTypes.STRING(40),
    role: role_type, // Replace with actual enum values
  }, {
    tableName: 'volunteer',
    timestamps: false,
  });
  
  // Associations
  Center.hasMany(Classes, { foreignKey: 'center_id' });
  Classes.belongsTo(Center, { foreignKey: 'center_id' });
  
  ClassMap.hasMany(ClassLog, { foreignKey: 'map_id' });
  ClassLog.belongsTo(ClassMap, { foreignKey: 'map_id' });
  
  Classes.hasMany(ClassMap, { foreignKey: 'class_id' });
  ClassMap.belongsTo(Classes, { foreignKey: 'class_id' });
  
  Student.hasMany(ClassMap, { foreignKey: 'student_id' });
  ClassMap.belongsTo(Student, { foreignKey: 'student_id' });
  
  Volunteer.hasMany(ClassMap, { foreignKey: 'volunteer_id' });
  ClassMap.belongsTo(Volunteer, { foreignKey: 'volunteer_id' });
  
  Center.hasMany(Student, { foreignKey: 'centre_id' });
  Student.belongsTo(Center, { foreignKey: 'centre_id' });
  
  Center.hasMany(Volunteer, { foreignKey: 'centre_id' });
  Volunteer.belongsTo(Center, { foreignKey: 'centre_id' });
  
  Classes.hasMany(Volunteer, { foreignKey: 'class_id' });
  Volunteer.belongsTo(Classes, { foreignKey: 'class_id' });

  return {
    Center,
    Classes,
    ClassLog,
    ClassMap,
    Student,
    Volunteer
  }

}