function CreatorTask2(){}

CreatorTask2.prototype.getItemId = function(db_conn, res) {
    do{
        //Busca as legendas de um vídeo qualquer
        var legendas = getLegendasVideo();
        //Armazena a id do vídeo pegando o indice 0, pois todos os indices deverão ter o mesmo id_video
        var id_video_escolhido = legendas[0].id_video;
        //Busca as submissions ja feitas passando o id do video
        var submissions = getSubmissionsVideo(id_video_escolhido);

        //Verifica se o video já atingiu 5 submissions, em casa negativo, prosseguir
        if(submissions.length < 5){
            db_conn.query(sql, function (err, result) {
                if (err) {
                    res.status(404).send('Item not found 2');
                    console.log(err.toString());
                    return
                }

                if(result.length < 1) {
                    res.status(404).send('Item not found')
                } else {
                    //Monta o objeto de envio
                    var task_subtitles = {
                        id_video: id_video_escolhido,
                        //Contem todas as legendas do vídeo
                        legenda: legendas,
                        //Busca a legenda original do video em questão
                        legenda_original: getOriginalSubtitleVideo(id_video_escolhido)
                    };
                    res.contentType('application/json').status(200).send(JSON.stringify(task_subtitles));

                    global.fifoTarefa2Enviada.push(result[0].id_video.toString());
                }
            });
        }
        //Caso o video retornado pelo banco tenha mais que 5 submissions, retonar ao inicio do loop e buscar outro
    }while(submissions.length >= 5);
};

function getOriginalSubtitleVideo(id_video_get){
    var sql = 'SELECT * FROM task1 WHERE id_video = '+id_video_get ;

    db_conn.query(sql, function (err, result) {
        if (err) {
            res.status(404).send('Item not found 2');
            console.log(err.toString());
            return
        } else {
            return result;
        }
    });
}

function getSubmissionsVideo(id_video_get){
    var sql = 'SELECT * FROM task2submissions AS b WHERE b.id_video = '+id_video_get ;

    db_conn.query(sql, function (err, result) {
        if (err) {
            res.status(404).send('Item not found 2');
            console.log(err.toString());
            return
        } else {
            return result;
        }
    });
}

function getLegendasVideo(){
    var sql_where = "";
    for(var i=0; i < global.fifoTarefa2Enviada.length; i++){
        if(i == 0){
            sql_where += "WHERE a.id != " + global.fifoTarefa2Enviada[i];
        }else{
            sql_where += " AND a.id != " + global.fifoTarefa2Enviada[i];
        }
    }

    var sql = 'SELECT a.id, a.id_video, a.legenda FROM task2 AS a LEFT JOIN task2submissions AS b ON a.id_video = b.id_video '+ sql_where +' GROUP BY a.id ASC LIMIT 5';

    db_conn.query(sql, function (err, result) {
        if (err) {
            res.status(404).send('Item not found 2');
            console.log(err.toString());
            return
        }

        if(result.length < 1) {
            res.status(404).send('Item not found')
        } else {
            return result;
        }
    });
}

module.exports = new CreatorTask2();