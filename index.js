var express = require('express');
var bodyParser = require('body-parser');
let config = require('./config')
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var server = app.listen(config.PORT, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log(`Server start at port : => ${port}`)
});

