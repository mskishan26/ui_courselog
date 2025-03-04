const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config');

//initialize sequelize instance
const sequelize = new Sequelize(config.db_name, config.db_username, config.db_password, {
  host: config.db_host,
  dialect: config.db_dialect, // Explicitly pass the dialect
  pool: config.pool,
  // logging: config.logging, // If you have logging in your config
});


//The original idea was to send a sequelize object and then use it build the models and return them. These models would then be used as parameters.
// But the main failure with this line of thought is that every time we need the models in a different file, we need to include them as an argument to the functions.
// Now requiring the main server.js file would create circular dependencies and would be bad so we are not doing that an instead send the sequelize object itself in this mapping.

//ENUM Values
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const VOLUNTEER_ROLES = ['L1', 'L2', 'L3', 'L4'];
const CLASS_TYPES = ['Tuition', 'Life Skills', 'Holiday', 'Other'];


// Center Model
  const Center = sequelize.define('Center', {
    center_id: {
      type: DataTypes.STRING(40),
      primaryKey: true,
    },
    name: DataTypes.STRING(100),
    address: DataTypes.STRING(500),
    point_of_contact: DataTypes.STRING(100),
    phone_num: {
        type : DataTypes.STRING(15),
        validate: {
            isNumeric: true,
            len: [10, 10]
          }},
  }, {
    tableName: 'Centers',
    timestamps: true,
  });
  
  // Class Model
  const Class = sequelize.define('Class', {
    class_id: {
      type: DataTypes.STRING(40),
      primaryKey: true,
    },
    subject: DataTypes.STRING(40),
    center_id: DataTypes.STRING(40),
    day: {
      type: DataTypes.ENUM,
      values: DAYS_OF_WEEK,
      defaultValue: 'Sunday',
      allowNull: false,
    },
    time: DataTypes.TIME,
  }, {
    tableName: 'Classes',
    timestamps: true,
  });
  
  // Student Model
  const Student = sequelize.define('Student', {
    student_id: {
      type: DataTypes.STRING(40),
      primaryKey: true,
    },
    student_grade: DataTypes.INTEGER,
    student_name: DataTypes.STRING(100),
    center_id: {type : DataTypes.STRING(40),
        allowNull : false}
  }, {
    tableName: 'Students',
    timestamps: true,
  });
  
  // Volunteer Model
  const Volunteer = sequelize.define('Volunteer', {
    volunteer_id: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      validate: {
        isEmail: true
      }
    },
    phone_num: {
        type : DataTypes.STRING(15),
        validate: {
            isNumeric: true,
            len: [10, 10]
          }},
    reporting_leader: DataTypes.STRING(100),
    volunteer_name: DataTypes.STRING(100),
    center_id: DataTypes.STRING(40),
    class_id: DataTypes.STRING(40),
    volunteer_role: {type: DataTypes.ENUM,
        values: VOLUNTEER_ROLES,
        defaultValue: 'L1'
    },
    firebase_uid: {
        type: DataTypes.STRING(128),
        allowNull: true
    },
  }, {
    tableName: 'Volunteers',
    timestamps: true,
    indexes: [
        {
          name: "idx_firebase_uid_when_not_null",
          unique: true,
          fields: ["firebase_uid"],
          where: {
            firebase_uid: {
              [Sequelize.Op.ne]: null, // Ensures uniqueness only when NOT NULL
            },
          },
        },
      ],
});

//Student-Class Map Model
const StudentClassMapping = sequelize.define('StudentClassMapping',{
    student_class_mapping_id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
  },
  student_id: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  class_id: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: 'StudentClassMappings',
  timestamps : true
});

// VolunteerStudentClassMapping
const VolunteerStudentClassMapping = sequelize.define('VolunteerStudentClassMapping', {
  volunteer_id: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  student_class_mapping_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
}, {
  tableName: 'VolunteerStudentClassMappings',
  timestamps: true
});

//Pre class log model
const PreClassLog = sequelize.define('PreClassLog', {
  log_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  student_class_mapping_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  volunteer_id: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  class_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  classtype: {
    type: DataTypes.ENUM,
        values: CLASS_TYPES,
        defaultValue: 'Tuition',
    allowNull: false
  },
  planned_chapter: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  planned_concepts: {
    type: DataTypes.STRING(400),
    allowNull: true
  },
  extra_resources: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  plan_outline: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pre_screen_flag: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  pre_complete_flag: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
}, {
  tableName: 'PreClassLogs',
  timestamps: true
});

//Post class log model
const PostClassLog = sequelize.define('PostClassLog', {
  log_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  student_class_mapping_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  volunteer_id: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  class_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  post_class_log: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  library_flag: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  post_quiz_score: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  post_comments: {
    type: DataTypes.STRING(3000),
    allowNull: true
  },
  post_complete_flag: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  post_class_rating: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
}, {
  tableName: 'PostClassLogs',
  timestamps: true
});

// Base Associations
Center.hasMany(Class, { foreignKey: 'center_id'  });
Class.belongsTo(Center, { foreignKey: 'center_id' });

Center.hasMany(Student, { foreignKey: 'center_id' });
Student.belongsTo(Center, { foreignKey: 'center_id' });

Center.hasMany(Volunteer, { foreignKey: 'center_id' });
Volunteer.belongsTo(Center, { foreignKey: 'center_id' });

Class.hasMany(Volunteer, { foreignKey: 'class_id' });
Volunteer.belongsTo(Class, { foreignKey: 'class_id' });

// volunteer self referencing 
Volunteer.belongsTo(Volunteer, { 
    as: 'leader', 
    foreignKey: 'reporting_leader' 
  });
  
  Volunteer.hasMany(Volunteer, { 
    as: 'subordinates', 
    foreignKey: 'reporting_leader' 
  });

// Student class associations
Student.belongsToMany(Class, { through: StudentClassMapping,
    foreignKey: 'student_id',
    otherKey: 'class_id' });
Class.belongsToMany(Student, { through: StudentClassMapping,
    foreignKey: 'class_id',
    otherKey: 'student_id' });

StudentClassMapping.belongsTo(Student, { foreignKey: 'student_id' });
StudentClassMapping.belongsTo(Class, { foreignKey: 'class_id' });

// volunteer student class associations
VolunteerStudentClassMapping.belongsTo(Volunteer, {foreignKey: 'volunteer_id'});

VolunteerStudentClassMapping.belongsTo(StudentClassMapping, {foreignKey: 'student_class_mapping_id'});

StudentClassMapping.hasMany(VolunteerStudentClassMapping, {foreignKey: 'student_class_mapping_id' });

Volunteer.hasMany(VolunteerStudentClassMapping, {foreignKey: 'volunteer_id' });


// pre post class log associations with student class mapping
StudentClassMapping.hasMany(PreClassLog, {foreignKey: 'student_class_mapping_id'});
PreClassLog.belongsTo(StudentClassMapping, {foreignKey: 'student_class_mapping_id'});

StudentClassMapping.hasMany(PostClassLog, {foreignKey: 'student_class_mapping_id'});
PostClassLog.belongsTo(StudentClassMapping, {foreignKey: 'student_class_mapping_id'});

// volunteer mapping with pre post class logs
Volunteer.hasMany(PreClassLog, {foreignKey: 'volunteer_id'});
PreClassLog.belongsTo(Volunteer, {foreignKey: 'volunteer_id'});

Volunteer.hasMany(PostClassLog, {foreignKey: 'volunteer_id'});
PostClassLog.belongsTo(Volunteer, {foreignKey: 'volunteer_id'});

StudentClassMapping.addHook('beforeCreate', 'centerVerification', async (mapping, options) => {
    const student = await Student.findByPk(mapping.student_id, { transaction: options.transaction });
    const classObj = await Class.findByPk(mapping.class_id, { transaction: options.transaction });
    
    if (student.center_id !== classObj.center_id) {
      throw new Error('Students can only take classes at their assigned center');
    }
  });  

  module.exports = {
    sequelize,
    Center,
    Class,
    Student,
    Volunteer,
    StudentClassMapping,
    VolunteerStudentClassMapping,
    PreClassLog,
    PostClassLog
  };