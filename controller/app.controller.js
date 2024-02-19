const {selectTopics} = require("../model/app.model.js")
const data = require('../endpoints.json');


const getAllTopics = (req, res, next) => {
    selectTopics().then((data) => {
        res.status(200).send({status: 200, rows: data})
    }).catch((err) => {
        next(err)
    })
}

const getApis = (req, res, next) => {
    res.status(200).send({status: 200, apiData: data})
}




module.exports = {getAllTopics, getApis}