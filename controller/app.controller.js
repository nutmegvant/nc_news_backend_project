const { selectTopics, selectArticleById, selectArticles, selectAllCommentsForArticle, insertComment, addNewVotes } = require("../model/app.model.js");
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
            res.status(200).send({ article: data[0] });
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
            res.status(200).send({ comments: data, msg: 'No comments yet' })
        } else{
            res.status(200).send({ comments: data })
        }
    })
    .catch((err) => {
        next(err);
    });
}

const postComment = (req, res, next) => {
    insertComment(req.params.article_id, req.body.author, req.body.comment)
    .then((comment) => {
        res.status(201).send({comment});
    })
    .catch((err) => {
        next(err);
    })
}

const updateVotes = (req, res, next) => {
    addNewVotes(req.params.article_id, req.body.inc_votes)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err);
    })
}

module.exports = { getAllTopics, getApis, wrongPath, getArticleById, getAllArticles, getComments, postComment, updateVotes };
