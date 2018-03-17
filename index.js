const express = require('express');
const bodyParser = require('body-parser');
let config = require('./config')
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(require('./routes'));

const server = app.listen(config.PORT, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Server start at port : => ${port}`)
});