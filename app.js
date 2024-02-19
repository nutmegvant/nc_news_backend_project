const db = require('./db/connection.js')
const express = require('express')
const {getAllTopics, getApis} = require('./controller/app.controller.js')

const app = express()

app.use(express.json())

app.get('/api/topics', getAllTopics)

app.get('/api', getApis)


app.use((err, request, response, next) => {
    if (err.status && err.msg) {
        response.status(err.status).send({msg: err.msg})
    }
    })

app.use((err, request, response, next) => {
    if (err.status === 404) {
        response.status(404).send({msg: 'Invalid URL'})
    }
})

module.exports = app;
