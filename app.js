var express = require('express');        // call express
var app = express();                 // define our app using express
var bodyParser = require('body-parser');
var mysql = require('mysql');

app.use(express.static('videos'));

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

var spawn = require('child_process').spawn;
spawn('node', ['pre-processing-srt.js', 'inglourious-basterds-english']);

var pool = mysql.createPool(process.env.CLEARDB_DATABASE_URL || {
    host: 'localhost',
    user: 'root',
    database: 'crowdsub'
});

pool.getConnection(function(err, connection) {
	if (!err) {
        console.log("Database is connected ... nn");
    } else {
        console.log("Error connecting database ... nn");
    }


    global.fifoTarefas = [];

    global.fifoTarefa2Enviada = [];
    global.fifoTarefa2Recebida = [];

    // Task 1 - Extrair legendas do vídeo
    var creatorTask1 = require("./services/CreatorTask1");
    creatorTask1.prepareVideoQueue(connection);
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
    var creatorTask2 = require("./services/CreatorTask2");
    router.get('/task2', function (req, res) {
        console.log("GET /task2");
        console.log('Body: ' + JSON.stringify(req.body));

        creatorTask2.getItemId(connection, res);
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
});
