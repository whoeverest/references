var express = require('express');
var anydb_sql = require('anydb-sql');

var app = express();
app.use(express.static('public'));

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

db.query('create table POSTS(id PRIMARY KEY, text, created)', function(err, res) {
    console.log(err, res);
})

post.insert(post.text.value('First post'), post.created.value(Date.now())).exec(function(a,b,c) {
    console.log(a,b,c);
});

app.get('/posts', function(req, res) {
    post.select().from(post).all(function(err, posts) {
        res.end(posts.toString());
        console.log(posts);
    });
})

var port = 8080;
console.log('Listening to localhost:', port);

app.listen(8080);