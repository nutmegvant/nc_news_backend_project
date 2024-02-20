const format = require("pg-format");
const db = require("../db/connection.js");

const selectTopics = () => {
    return db.query("SELECT * FROM topics;").then((result) => {
        return result.rows;
    });
};

const selectArticle = (id) => {
    const query = "SELECT * FROM articles WHERE article_id = $1;";
    let params = [id];
    return db.query(query, params).then((result) => {
        return result.rows;
    });
};

module.exports = {
    selectTopics,
    selectArticle,
};
