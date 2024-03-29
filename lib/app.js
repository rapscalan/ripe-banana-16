const express = require('express');
const app = express();

//app.use(express.static(__dirname + '/../public'));

app.use(express.json());
app.use(require('cookie-parser')());

app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/studios', require('./routes/studios'));
app.use('/api/v1/actors', require('./routes/actors'));
app.use('/api/v1/reviewers', require('./routes/reviewers'));
app.use('/api/v1/reviews', require('./routes/reviews'));
app.use('/api/v1/films', require('./routes/films'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
