const express = require("express");
const MongoClient = require('mongodb').MongoClient
const cors = require('cors');
const { resolveInclude } = require('ejs');
const { response } = require('express');

const app = express();
require('dotenv').config();

let db, 
    dbConnectionString = process.env.MONGODB_URI,
    dbName = "raccoonplace",
    collection

    MongoClient.connect(dbConnectionString)
    .then(client => {
        console.log('Connected to Database')
        db = client.db(dbName)
        collection = db.collection('raccoonImages')
    })

app.set("json spaces", 2);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ encoded: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

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

app.get("/secretRaccoonLair", (req, res) => {
    res.render('secretRaccoonLair.ejs')
})

app.post("/upload", (req, res) => {
    db.collection("raccoons").insertOne({img: req.body.image, alt: req.body.alt, likes: 0, dislikes: 0}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/secretRaccoonLair')
    })
})

app.listen(process.env.PORT || PORT, () => {
    console.log('it do be raccooning time')
})
