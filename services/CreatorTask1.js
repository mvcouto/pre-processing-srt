var Q = require('q');

function CreatorTask1(){}


CreatorTask1.prototype.getItemId = function(db_conn, res) {
    console.log(global.fifoTarefas);

    var id_video = global.fifoTarefas[0];

    Q.all([getVideosNaoCompletosComLegenda(db_conn)]).then(function (results) {
        var videosNaoCompletos = results[0][0];

        if(videosNaoCompletos.length == 0) {
            res.status(404).send("Não há mais itens a serem respondidos");
            return;
        }

        var legenda = "";
        for(var i=0; i < videosNaoCompletos.length; i++) {
            if(id_video == videosNaoCompletos[i].id) {
                legenda = videosNaoCompletos[i].legend;
                break;
            }
        }
        removeHead(global.fifoTarefas);
        if(legenda == "") {
            var creatorTask1 = new CreatorTask1();
            creatorTask1.getItemId(db_conn, res);
            return;
        }

        global.fifoTarefas.push(id_video);

        console.log(global.fifoTarefas);

        var resObj = {
            id_video: id_video,
            legenda: legenda
        };
        res.status(200).send(JSON.stringify(resObj));
    })
};

CreatorTask1.prototype.prepareVideoQueue = function(db_conn) {
    Q.all([getVideosNaoCompletosComLegenda(db_conn)]).then(function (results) {
        for(var i=0; i < results[0][0].length; i++) {
            global.fifoTarefas.push(results[0][0][i].id);
        }
        console.log(global.fifoTarefas);
    });
};


var getVideosNaoCompletosComLegenda = function(db_conn) {
    var sql = 'SELECT a.id, a.legend FROM task1 AS a LEFT JOIN task1submissions AS b ON a.id = b.id_video GROUP BY a.id HAVING COUNT(*) < 5 ORDER BY COUNT(a.id) ASC;';

    var defered = Q.defer();
    db_conn.query(sql, defered.makeNodeResolver());
    return defered.promise;
};

var removeHead = function (fila) {
  fila.splice(0, 1);
};

module.exports = new CreatorTask1();