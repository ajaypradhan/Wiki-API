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

app.get('/', function (req, res) {
    res.send('connected');
});

// Requested targeting all articles

app.route('/articles')
    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (err) {
                console.log(err);
            } else {
                res.send(foundArticles);
            }
        });
    })
    .post(function (req, res) {
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
    })
    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            //delete all the entry
            if (err) {
                res.send(err);
            } else {
                res.send('Successfully Deleted all articles');
            }
        });
    });

// request targeting specific Article

app.route('/articles/:articleTitle')
    .get(function (req, res) {
        Article.findOne(
            { title: req.params.articleTitle },
            function (err, foundArticle) {
                if (err) {
                    res.send(err);
                } else if (foundArticle) {
                    res.send(foundArticle);
                } else {
                    res.send('Article not found');
                }
            }
        );
    })
    .put(function (req, res) {
        Article.update(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            function (err) {
                if (err) {
                    res.send(err);
                } else {
                    res.send('SuccessFully Updated');
                }
            }
        );
    })
    .patch(function (req, res) {
        Article.update(
            { title: req.params.articleTitle },
            { $set: req.body },
            function (err) {
                if (err) {
                    res.send(err);
                } else {
                    res.send('done');
                }
            }
        );
    })
    .delete(function (req, res) {
        Article.findOneAndDelete({ title: req.params.articleTitle }, function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send('Deleted Successfully');
            }
        });
    });

app.listen(process.env.PORT || 3000, function () {
    console.log('Server Started');
});
