const {selectTopics} = require("../model/app.model.js")


const getAllTopics = (req, res, next) => {
    selectTopics().then((data) => {
        res.status(200).send({status: 200, rows: data})
    }).catch((err) => {
        next(err)
    })
}





module.exports = {getAllTopics}