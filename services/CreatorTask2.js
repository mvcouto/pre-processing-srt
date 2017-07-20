function CreatorTask2(){}


CreatorTask2.prototype.getItemId = function(db_conn, res) {
    var sql_where = "";
    for(var i=0; i < global.fifoTarefa2Enviada.length; i++){
      sql_where += " AND a.id_video != " + global.fifoTarefaEnviada[i];
    }

    var sql = 'SELECT * FROM task2 AS a LEFT JOIN task2submissions AS b ON a.id_video = b.id_video WHERE (SELECT COUNT(*) FROM task2submissions) < 5 '+sql_where+' GROUP BY a.id ASC LIMIT 5';

    db_conn.query(sql, function (err, result) {
        if (err) {
            res.status(404).send('Item not found 2');
            console.log(err.toString());
            return
        }

        if(result.length < 1) {
            res.status(404).send('Item not found')
        } else {
            var task_subtitles = {
                id_video: result[0].id_video,
                legenda: [],
                legenda_original: result[0].legenda
            };

            for(var i=0; i < result.length; i++){
              var array = {
                id: result[i].id,
                id_video: result[i].id_video,
                legenda: result[i].legenda,
              }
              task_subtitles.legenda.push(array);
            }
            res.contentType('application/json').status(200).send(JSON.stringify(task_subtitles));

            global.fifoTarefa2Enviada.push(result[0].id_video.toString());
        }
    });
};

module.exports = new CreatorTask2();
