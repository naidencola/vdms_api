var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validate = require('express-jsonschema').validate;

var products = require('./routes/products');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/', function (req, res, next) {
	console.log('Request Url:' + req.url);
	next();
});

app.use('/api/v1/products', products);
app.use(function(err, req, res, next) {
    var responseData;
    if (err.name === 'JsonSchemaValidation') {
        console.log(err.message);
        res.status(400);
        responseData = {
           statusText: 'Bad Request',
           jsonSchemaValidation: true,
           validations: err.validations 
        };
  
        if (req.xhr || req.get('Content-Type') === 'application/json') {
            res.json(responseData);
        }
    } else { 
        next(err);
    }
});
module.exports = app;
