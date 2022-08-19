const express = require('express');
var app = express();
const bodyparser = require('body-parser');
const route=require('./router/route')

app.use(bodyparser.json());

app.use('/', route)

app.listen(3000, () => console.log('Express server is running at port no : 3000'));