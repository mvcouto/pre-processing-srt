function SubmissionTask2(){}

SubmissionTask2.prototype.insertSubmission = function(res, db_conn, id_video, id_legenda, tinicial, tfinal, fingerprint) {
    var sql = "INSERT INTO task2submissions (id_video, id_legenda, tinicial, tfinal, fingerprint) VALUES ("
        + "'" + id_video + "', "
        + "'" + id_legenda + "', "
        + "'" + tinicial + "', "
        + "'" + tfinal + "', "
        + "'" + fingerprint + "');";

    db_conn.query(sql, function (err, result) {
        if (err) {
            res.status(500).send('Submission rejected');
            console.log(err.toString());
            return
        }

        var index = global.fifoTarefa2Enviada.indexOf(id_video);
        if(index > -1) {
            global.fifoTarefas = global.fifoTarefa2Enviada.splice(index, 1);
        }

        console.log("1 record inserted, ID: " + result.insertId);
        res.status(200).send('Submission accepted');
    });
};

module.exports = new SubmissionTask2();
