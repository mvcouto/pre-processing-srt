function CreatorTask2(){}

//Contem as legendas do video
var legendas = [];
//Contem as submissions do video
var submissions = [];
//Contem a legenda original
var original_subtitle = "none";
//Armazena a quantidade total de vídeos
var qtd_total_videos = 0;

CreatorTask2.prototype.getItemId = function(db_conn, res) {
    var i=0;
    getTotalOfVideos(db_conn, res);
    do{
        //Busca as legendas de um vídeo qualquer
        getLegendasVideo(db_conn, res);
        //Armazena a id do vídeo pegando o indice 0, pois todos os indices deverão ter o mesmo id_video
        var id_video_escolhido = legendas[0].id_video;
        //Busca as submissions ja feitas passando o id do video
        getSubmissionsVideo(db_conn, res, id_video_escolhido);

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
                    getOriginalSubtitleVideo(db_conn, res, id_video_escolhido);
                    //Monta o objeto de envio
                    var task_subtitles = {
                        id_video: id_video_escolhido,
                        //Contem todas as legendas do vídeo
                        legenda: legendas,
                        //Busca a legenda original do video em questão
                        legenda_original: original_subtitle
                    };
                    res.contentType('application/json').status(200).send(JSON.stringify(task_subtitles));

                    global.fifoTarefa2Enviada.push(result[0].id_video.toString());
                }
            });
        }
        //Enquanto houver algum video sem o total de avaliacoes, identifique-o e entregue ao usuário
        i++;py
    }while(i < qtd_total_videos);
};

function getSubmissionsVideo(db_conn, res, id_video_get){
    var sql = 'SELECT * FROM task2submissions AS b WHERE b.id_video = '+id_video_get ;

    db_conn.query(sql, function (err, result) {
        if (err) {
            res.status(404).send('Item not found 2');
            console.log(err.toString());
            return
        } else {
            submissions = result;
        }
    });
}

function getLegendasVideo(db_conn, res){
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
            legendas = result;
        }
    });
}

//////////////////////////

function getOriginalSubtitleVideo(db_conn, res, id_video_get){
    var sql = 'SELECT * FROM task1 WHERE id_video = '+id_video_get ;

    db_conn.query(sql, function (err, result) {
        if (err) {
            res.status(404).send('Item not found 2');
            console.log(err.toString());
            return
        } else {
            original_subtitle = result.legend;
        }
    });
}

function getTotalOfVideos(db_conn, res){
    var sql = 'SELECT COUNT(*) as qtd_total FROM task1';

    db_conn.query(sql, function (err, result) {
        if (err) {
            res.status(404).send('Item not found 2');
            console.log(err.toString());
            return
        } else {
            qtd_total_videos = result.qtd_total;
        }
    });
}

module.exports = new CreatorTask2();