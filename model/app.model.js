const format = require("pg-format");
const db = require("../db/connection.js");

const selectTopics = () => {
    return db.query("SELECT * FROM topics;").then((result) => {
        return result.rows;
    });
};

const selectArticleById = (id) => {
    const query = "SELECT * FROM articles WHERE article_id = $1;";
    let params = [id];
    return db.query(query, params).then((result) => {
        if (result.rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: "Article does not exist"
                })
            }
            else {
        return result.rows;
            }
    });
};

const selectArticles = () => {
    return db
        .query(
            `SELECT 
            articles.article_id,
            articles.author,
            articles.title,
            articles.topic,
            articles.created_at,
            articles.votes,
            articles.article_img_url,
            COALESCE(SUM(comments.comment_id),0) as comments_count
    FROM articles LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY  articles.article_id, articles.author, articles.title, articles.topic, articles.created_at,   articles.votes, articles.article_img_url
    ORDER BY articles.created_at DESC;`
        )
        .then((result) => {
            return result.rows;
        });
};

const selectAllCommentsForArticle = (id) => {
    const query =
        "SELECT * FROM comments WHERE article_id =$1 ORDER BY created_at ASC";
    let params = [id];
    return db
    .query(query, params)
    .then((results) => {
        return results.rows 
    })
}



const insertComment = (id, username, body) => {
    return db
    .query(`INSERT INTO comments(author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING *;`, [username, body, id])
    .then((result) => {
        return result.rows[0]
    })
}


module.exports = {
    selectTopics,
    selectArticleById,
    selectArticles,
    selectAllCommentsForArticle,
    insertComment,
};
