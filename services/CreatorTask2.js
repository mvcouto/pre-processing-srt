var Q  = require('q');

var unfinishedTasksQueue = [];
var numRequests = 0;
var db_conn = null;

function CreatorTask2(connection) {
    db_conn = connection;
    generateUnfinishedTasksQueue();
}

function generateUnfinishedTasksQueue() {
    unfinishedTasksQueue = [];
    getVideosNaoCompletados()
        .then(function (result) {
            for(var i=0; i< result[0].length; i++) {
                unfinishedTasksQueue.push(result[0][i].id_video);
            }
        })
        .catch(function (error) {
            throw error;
        })
        .done();
}

CreatorTask2.prototype.getItem = function (res) {
    var id_video = unfinishedTasksQueue[0];
    removeHead(unfinishedTasksQueue);
    unfinishedTasksQueue.push(id_video);

    console.log('Vídeo escolhido: ', id_video);
    console.log('numRequests: ', numRequests);
    console.log('Estado da fila: ', unfinishedTasksQueue.toString());
/*
    getVideosNaoCompletados()
        .then(function (result) {
            var itensNaoCompletos = result[0];
            if(itensNaoCompletos.length == 0) {
                res.status(404).send('Não há mais itens a serem respondidos');
                return null;
            }

            var itemIncompleto = false;
            for(var i=0; i< result[0].length; i++) {
                if(id_video == result[0][i].id) {
                    itemIncompleto = true;
                    break;
                }
            }

            if(!itemIncompleto) {
                CreatorTask2.prototype.getItem(res);
                return null;
            }

            unfinishedTasksQueue.push(id_video);

            return getDadosItem(id_video);
        }) */
    getDadosItem(id_video)
        .then(function (result) {
            if(result == null) {
                return;
            }

            var responseObj = {
                id_video: result[0][0].id_video,
                legendas: getListaLegendas(result[0]),
                legenda_original: result[0][0].legend
            };
            res.status(200).send(responseObj);
        })
        .catch(function (error) {
            res.status(500).send('Internal server error');
            throw error;
        })
        .done();

    numRequests = numRequests + 1;
    if(numRequests > 9) {
        numRequests = 0;
        generateUnfinishedTasksQueue();
    }
};

function getListaLegendas(dados) {
    var lista = [];
    for (var i = 0; i < dados.length; i++) {
        lista.push({
            'id': dados[i].id,
            'legenda': dados[i].legenda
        });
    }
    return lista;
}

function getDadosItem(id_video) {
    var sql = 'SELECT b.id_video, a.legend, b.id, b.legenda FROM task1 AS a INNER JOIN task2 AS b ON a.id = b.id_video WHERE a.id = ?;';
    return Q.ninvoke(db_conn, "query", sql, id_video);
}

function getVideosNaoCompletados() {
    var sql = 'SELECT a.id_video FROM (SELECT id_video FROM task2 GROUP BY id_video HAVING COUNT(*) > 1) as a LEFT JOIN task2submissions as b ON a.id_video = b.id_video GROUP BY a.id_video ORDER BY COUNT(a.id_video);';
    return Q.ninvoke(db_conn, "query", sql);
}

var removeHead = function (fila) {
    fila.splice(0, 1);
};

module.exports = function (db) {
    return new CreatorTask2(db);
};
