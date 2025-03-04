const path = require('path');
const { Sequelize } = require('sequelize');
const config = require(path.join(__dirname, 'config', 'config.js'));
const sequelize = new Sequelize(config.database, config.username, config.password, {...config,
    logging: (msg) => logger.info(msg),}
   );
const models = require('./models/model.js')(sequelize);
const logger = require(path.join(__dirname, 'config', 'logger.js'));

// console.log(path.join(__dirname, 'models', 'model.js'))
console.log(models)

async function checkSync() {


  try {
    logger.info('Starting database sync check')
    // This will log the SQL statements without executing them
    await sequelize.sync({ alter: true, force: false});
    console.log('after sync')
    console.log(Object.keys(models))
    // Check each model
    for (const modelName of Object.keys(models)) {
      const model = models[modelName];
      logger.info(`Checking model: ${modelName}`);
      console.log('in loop')
      // Get the current table structure
      const tableDescription = await model.describe();
      logger.info('Current table structure:', tableDescription);
      
      // Compare with model definition
      const attributes = model.rawAttributes;
      for (const attrName of Object.keys(attributes)) {
        const modelAttr = attributes[attrName];
        const tableAttr = tableDescription[attrName];
        
        if (!tableAttr) {
          logger.error(`Missing column in table: ${attrName}`);
        } else {
          // Compare data types, constraints, etc.
          // This is a simplified check. You might need to add more detailed comparisons.
          if (modelAttr.type.toString() !== tableAttr.type) {
            logger.error(`Mismatch in column ${attrName}: Model type: ${modelAttr.type.toString()}, Table type: ${tableAttr.type}`);
          }
        }
      }
      
      // Check for extra columns in the table
      for (const colName of Object.keys(tableDescription)) {
        if (!attributes[colName]) {
          logger.error(`Extra column in table: ${colName}`);
        }
      }
    }
  } catch (error) {
    logger.error('Error during sync check:', error);
  } finally {
    await sequelize.close();
  }
}

// checkSync().catch(error => logger.error('Unhandled error:', error));