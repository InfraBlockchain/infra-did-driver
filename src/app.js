const express = require('express');
const app = express();

import config from '../config.json';

app.get('/', (req, res, next) => {
    res.send("Hello world");
})

require('./routes/v1')(app);

var server = app.listen(config.port, () => {
    console.log(`Example app running on ${config.port}`)
})