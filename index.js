const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient
const cors = require('cors');
const { resolveInclude } = require('ejs');
const { response } = require('express');

const app = express();
require('dotenv').config();

let db, dbCollection;

const url = process.env.DB_STRING;
const dbName = "raccoonplace";

app.set("json spaces", 2);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ encoded: true }));
app.use(express.json());
app.use(express.static("public"));


app.listen(process.env.PORT || PORT, () => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
})

app.get("/", (req, res) => {
    db.collection('raccoons').find().toArray((err, result) => {
        if (err) return console.log(err)
        let number = Math.floor(Math.random() * result.length)
        console.log(result[number])
        res.render('index.ejs', { raccoons: result[number] })
    })
})

app.get("/getData", (req, res) => {
    db.collection('raccoons').find().toArray((err, result) => {
        if (err) return console.log(err)
        res.json(result);
    })
})

