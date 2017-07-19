var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var mysql = require('mysql');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

var spawn = require('child_process').spawn;
spawn('node', ['pre-processing-srt.js', 'inglourious-basterds-english']);

var connection = mysql.createConnection(process.env.CLEARDB_DATABASE_URL || {
    host: 'localhost',
    user: 'root',
    database: 'crowdsub'
});

connection.connect(function (err) {
    if (!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log("Error connecting database ... nn");
    }
});


global.fifoTarefaEnviada = new Array();
global.fifoTarefaRecebida = new Array();

// Task 1 - Extrair legendas do vídeo
var creatorTask1 = require("./services/CreatorTask1");
router.get('/task1', function (req, res) {
    console.log("GET /task1");
    console.log('Body: ' + JSON.stringify(req.body));

    creatorTask1.getItemId(connection, res);
});

var submissionTask1Service = require("./services/SubmissionTask1");
router.post('/task1', function (req, res) {
    console.log("POST /task1");
    console.log('Body: ' + JSON.stringify(req.body));

    submissionTask1Service.insertSubmission(res,
        connection,
        req.body.id_video,
        req.body.legenda,
        req.body.tinicial,
        req.body.tfinal,
        req.body.fingerprint);
});


// Task 2 - Extrair melhor legendas, dentre as legendas sugeridas pelos usuários
router.get('/task2', function (req, res) {
    console.log("GET /task2");
    console.log('Body: ' + JSON.stringify(req.body));

    res.status(200).send("");
});

var submissionTask2Service = require("./services/SubmissionTask2");
router.post('/task2', function (req, res) {
    console.log("POST /task2");
    console.log('Body: ' + JSON.stringify(req.body));

    submissionTask2Service.insertSubmission(res,
        connection,
        req.body.id_legenda_escolhida,
        req.body.fingerprint);
});


app.use('/api', router);

app.listen(port);
console.log('Servidor rodando na porta: ' + port);
