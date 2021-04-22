const express = require('express');
const app = express();
const PORT = 8080;

app.get('/', (req, res, next) => {
    res.send("Hello world");
})

var server = app.listen(PORT, () => {
    console.log(`Example app running on ${PORT}`)
})