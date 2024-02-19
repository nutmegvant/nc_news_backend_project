const {selectTopics} = require("../model/app.model.js")
const data = require('../endpoints.json');


const getAllTopics = (req, res, next) => {
    selectTopics().then((data) => {
        res.status(200).send({rows: data})
    }).catch((err) => {
        next(err)
    })
}

const getApis = (req, res, next) => {
    res.status(200).send({apiData: data})
}

const wrongPath = (req, res, next) => {
    res.status(404).send({msg: 'Invalid URL'})
}


module.exports = {getAllTopics, getApis, wrongPath}