const format = require('pg-format')
const db = require('../db/connection.js')


const selectTopics = () => {
    return db.query('SELECT * FROM topics;').then((result) => {
        return result.rows;
        });
}


module.exports = {
    selectTopics
}