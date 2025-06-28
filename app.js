// node.js로 서버 생성하는 JS입니다.

const express = require('express');
const path = require('path');
const static = require('serve-static');

var app = express();
app.use('/W', static(path.join(__dirname, 'web')));

app.get('/', (req, res) => {
    res.redirect(302, '/w/index.html');
});

app.listen(3000, () => {
    console.log('server start!!!');
})

