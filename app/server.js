const {PORT, MURI, MDB} = require('./utils/configs');
const bodyParser = require('body-parser');
const express = require('express');
const { MongoClient } = require('mongodb');
const ValidationError = require('./errors/ValidationError');

let db = undefined;
const app = express();

/*
 * default request
 */
app.get('/', function(req, res, next) {
    res.status(200).json({ name: 'todo-demo' })
});


app.use(bodyParser.json());

/*
 * add db to request (silly middleware injection)
 */
app.use((req, res, next) => {
    req.db = db;
    next();
});

app.use(require('./todos/routes'));

/*
 * error handler
 */
app.use((err, req, res, next) => {
    if(err instanceof ValidationError){
        return res.status(400).json({error: err});
    }
    next(err);
});

app.listen(PORT, err => {
    console.log('listen');
    if (err) {
        throw err;
    }
    MongoClient.connect(MURI, { useNewUrlParser: true }, (e, c)=>{
        if(e){
            throw e;
        }
        db = c.db(MDB);
        app.emit("running");
    });
    console.log(`api-server listening on server port ${PORT}`);
});

module.exports = app;