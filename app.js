// simple express app to serve up custom APIs
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();


// allows CORS
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
  next();
});

app.use(express.static('public'))

app.use(bodyParser.json({
    limit: '50mb',
  }));
  
app.use('/', routes);

// catch 404 and forward to error handler
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({
      error: 'invalid token',
    });
  }

  next(err);
});

module.exports = app;
