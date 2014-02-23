var express = require('express');
var anydb_sql = require('anydb-sql');
var bluebird = require('bluebird');

// Model stuff
var db = anydb_sql({
    url: 'sqlite://memory'
})

var post = db.define({
    name: 'posts',
    columns: {
        id: { primary_key: true },
        text: {},
        created: {}
    },
    has: {
        comments: { from: 'comments', many: true }
    }
})

var comment = db.define({
    name: 'comments',
    columns: {
        id: { primary_key: true },
        text: {},
        created: {}
    }
})


var app = express();

app.configure(function() {
    db.query('create table POSTS(id PRIMARY KEY, text, created)', function(err, res) {
        if (err)
            console.log(err);
    })
})

app.use(express.static('public'));
app.use(express.urlencoded())
app.use(express.json())

app.get('/posts', function(req, res) {
    post.select().from(post).all(function(err, posts) {
        res.json(posts);
    })
})

app.post('/posts', function(req, res) {
    var text = post.text.value(req.body.text);
    var date = post.created.value(Date.now());
    post.insert(text, date).exec(function(err) {
        res.json({ status_code: 200, message: 'Created post.' });
    })
})

var port = 8080;
console.log('Listening to localhost:', port);

app.listen(8080);