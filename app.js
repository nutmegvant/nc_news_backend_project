const db = require("./db/connection.js");
const express = require("express");
const {
    getAllTopics,
    getApis,
    wrongPath,
    getArticleById,
    getAllArticles,
    getComments, postComment
} = require("./controller/app.controller.js");

const app = express();

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api", getApis);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);



app.get("*", wrongPath);

app.use((err, request, response, next) => {
    if (err.status && err.msg) {
        response.status(err.status).send({ msg: err.msg });
    } else if (err.code === "22P02") {
        response.status(400).send({ msg: "Bad Request" });
    }else if (err.code === "23503") {
        response.status(404).send({ msg: "Username not found" })
    } else {
        response.status(500).send({ msg: "Internal Server Error" });
    }
});

module.exports = app;
