const Sequelize = require('sequelize');
const db = require('../database/db');

module.exports = db.sequelize.define(
    'chatrooms',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        roomname: {
            type: Sequelize.STRING
        },
        roomuser: {
            type: Sequelize.STRING
        },
        message: {
            type: Sequelize.STRING
        },
        created: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    },
    {
        timestamps: false
    }
);