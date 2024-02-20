const { selectTopics, selectArticleById, selectArticles } = require("../model/app.model.js");
const data = require("../endpoints.json");

const getAllTopics = (req, res, next) => {
    selectTopics()
        .then((data) => {
            res.status(200).send({ topics: data });
        })
        .catch((err) => {
            next(err);
        });
};

const getApis = (req, res, next) => {
    res.status(200).send({ apiData: data });
};

const wrongPath = (req, res, next) => {
    res.status(404).send({ msg: "Invalid URL" });
};

const getArticleById = (req, res, next) => {
    if (Number.isNaN(parseInt(req.params.id))){
        res.status(400).send({ msg: "Bad request" });
    } else {
    selectArticleById(req.params.id)
        .then((data) => {
            if (data.length === 0){
                res.status(404).send({ msg: "Article does not exist" });
            } else {
            res.status(200).send({ article: data[0] });
            }
        })
        .catch((err) => {
            next(err);
        });
    }
};

const getAllArticles = (req, res, next) => {
    selectArticles()
        .then((data) => {
            const noBodyObj = data.map(article => (
            {
                article_id: article.article_id,
                title: article.title,
                topic: article.topic,
                author: article.author,
                created_at: article.created_at,
                votes: article.votes,
                article_img_url: article.article_img_url
            }
            ))
            res.status(200).send({ articles: noBodyObj });
        })
        .catch((err) => {
            next(err);
        });
};

module.exports = { getAllTopics, getApis, wrongPath, getArticleById, getAllArticles };
