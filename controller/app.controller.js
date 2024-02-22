const { selectTopics, selectArticleById, selectArticles, selectAllCommentsForArticle, insertComment } = require("../model/app.model.js");
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
    selectArticleById(req.params.id)
        .then((data) => {
            if (data.length === 0){
                return Promise.reject({
                    status: 404,
                    msg: "Article does not exist"
                    })
            } else {
            res.status(200).send({ article: data[0] });
            }
        })
        .catch((err) => {
            next(err);
        });
}

const getAllArticles = (req, res, next) => {
    selectArticles()
        .then((data) => {
            res.status(200).send({ articles: data });
        })
        .catch((err) => {
            next(err);
        });
};

const getComments = (req, res, next) => {
    selectAllCommentsForArticle(req.params.article_id)
    .then((data) => {
        if (data.length === 0){
            return Promise.reject({
                status: 404,
                msg: "Article does not have any comments"
                })
        } else {
        res.status(200).send({ comments: data })
        }
    })
    .catch((err) => {
        next(err);
    });
}

const postComment = (req, res, next) => {
    const newComment = req.body.comment;
    const author = req.body.author;
    insertComment(req.params.article_id, author, newComment)
    .then((comment) => {
        res.status(201).send({comment});
    })
    .catch((err) => {
        next(err);
    })
}


module.exports = { getAllTopics, getApis, wrongPath, getArticleById, getAllArticles, getComments, postComment, };
