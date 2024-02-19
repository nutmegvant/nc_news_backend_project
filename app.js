const db = require('./db/connection.js')
const express = require('express')
const {getAllTopics, getApis, wrongPath} = require('./controller/app.controller.js')

const app = express()

app.use(express.json())

app.get('/api/topics', getAllTopics)

app.get('/api', getApis)

app.get('*', wrongPath);


app.use((err, request, response, next) => {
    if (err.status && err.msg) {
        response.status(err.status).send({msg: err.msg})
    }
    })


module.exports = app;
