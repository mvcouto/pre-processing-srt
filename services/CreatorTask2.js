var Q  = require('q');

var unfinishedTasksQueue = [];
var db_conn = null;

function CreatorTask2(connection) {
    db_conn = connection;

    getVideosNaoCompletados()
        .then(function (result) {
            for(var i=0; i< result[0].length; i++) {
                unfinishedTasksQueue.push(result[0][i].id);
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

    getVideosNaoCompletados()
        .then(function (result) {
            var itensNaoCompletos = result[0];
            if(itensNaoCompletos.length == 0) {
                res.status(404).send('Não há mais itens a serem respondidos');
                return;
            }

            var itemIncompleto = false;
            for(var i=0; i< result[0].length; i++) {
                if(id_video == result[0][i].id) {
                    itemIncompleto = true;
                    break;
                }
            }

            if(!itemIncompleto) {
                getItem(res);
                return;
            }

            unfinishedTasksQueue.push(id_video);

            return getDadosItem(id_video);
        })
        .then(function (result) {
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
    var sql = 'SELECT a.id FROM task1 AS a LEFT JOIN task2submissions AS b ON a.id = b.id_video GROUP BY a.id HAVING COUNT(*) < 5;';
    return Q.ninvoke(db_conn, "query", sql);
}

var removeHead = function (fila) {
    fila.splice(0, 1);
};

module.exports = function (db) {
    return new CreatorTask2(db);
};