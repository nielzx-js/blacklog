const { Sequelize } = require('sequelize');
require('dotenv').config();
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('A variável de ambiente DATABASE_URL não foi definida.');
}

const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
});

module.exports=sequelize