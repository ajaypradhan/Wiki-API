const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const articleSchema = {
    title: String,
    content: String,
};

const Article = mongoose.model('Article', articleSchema);

//get route, find articles from wikiDB > article collection
app.get('/articles', function (req, res) {
    Article.find(function (err, foundArticles) {
        if (err) {
            console.log(err);
        } else {
            res.send(foundArticles);
        }
    });
});

app.get('/', function (req, res) {
    res.send('<h1>Start</h1>');
});

//post route, insert new data item in articles collections
app.post('/articles', function (req, res) {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content,
    });

    newArticle.save(function (err) {
        if (err) {
            res.send(err);
        } else {
            res.send('Successfully Added a new Article');
        }
    });
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Server Started');
});
