var Q = require('q');

function CreatorTask1() {
}

CreatorTask1.prototype.getItem = function (db_conn, res) {
    console.log(global.fifoTarefas);

    var id_video = global.fifoTarefas[0];

    getVideosNaoCompletosComLegenda(db_conn)
        .then(function (results) {
            var videosNaoCompletos = results[0];

            if (videosNaoCompletos.length == 0) {
                res.status(404).send("Não há mais itens a serem respondidos");
                return;
            }

            var legenda = "";
            for (var i = 0; i < videosNaoCompletos.length; i++) {
                if (id_video == videosNaoCompletos[i].id) {
                    legenda = videosNaoCompletos[i].legend;
                    break;
                }
            }
            removeHead(global.fifoTarefas);
            if (legenda == "") {
                var creatorTask1 = new CreatorTask1();
                creatorTask1.getItem(db_conn, res);
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
        .catch(function (error) {
            res.status(500).send('Internal server error');
            throw error;
        })
        .done();
};

CreatorTask1.prototype.prepareVideoQueue = function (db_conn) {
    getVideosNaoCompletosComLegenda(db_conn)
        .then(function (results) {
            for (var i = 0; i < results[0].length; i++) {
                global.fifoTarefas.push(results[0][i].id);
            }
            console.log(global.fifoTarefas);
        })
        .catch(function (error) {
            throw error;
        })
        .done();
};


function getVideosNaoCompletosComLegenda(db_conn) {
    var sql = 'SELECT a.id, a.legend FROM task1 AS a LEFT JOIN task1submissions AS b ON a.id = b.id_video GROUP BY a.id HAVING COUNT(*) < 5 ORDER BY COUNT(a.id) ASC;';
    return Q.ninvoke(db_conn, "query", sql);
}

var removeHead = function (fila) {
    fila.splice(0, 1);
};

module.exports = new CreatorTask1();