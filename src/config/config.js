// config.js
// module.exports = {
//       username: 'u5rh7imcag32q1',
//       password: 'p567d8023362e497ab12fc4ce6ee26d65e01213780bec9904a62dca2507345cfa',
//       database: 'd9soi4in45u4df',
//       host: 'c5flugvup2318r.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com',
//       dialect: 'postgres',
//       logging: console.log, // Set to false to disable logging
//       pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//       },
//       dialectOptions: {
//             ssl: {
//               require: true, 
//               rejectUnauthorized: false
//             }},
//     }

require('dotenv').config();


module.exports = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: console.log, // Set to false to disable logging
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    // dialectOptions: {
    //       ssl: {
    //         require: true, 
    //         rejectUnauthorized: false
    //       }},
  }