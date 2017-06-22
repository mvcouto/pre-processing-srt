var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();// get an instance of the express Router


// middleware to use for all requests
/*router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});*/

router.route('/submitTask1')
    .post(function(req, res) {
            res.json({ message: 'Mensagem recebida!' });
    });

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/task1', function(req, res) {
    res.json({ message: 'Acesso a dados da task1' });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Servidor rodando na porta: ' + port);
