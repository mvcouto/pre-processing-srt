function SubmissionTask1(){}

SubmissionTask1.prototype.insertSubmission = function(res, db_conn, id_video, answer, begin_time, end_time, fingerprint) {
    var sql = "INSERT INTO task1submissions (id_video, legenda, tinicial, tfinal, fingerprint) VALUES ("
        + "'" + id_video + "', "
        + "'" + answer + "', "
        + "'" + begin_time + "', "
        + "'" + end_time + "', "
        + "'" + fingerprint + "');";

    db_conn.query(sql, function (err, result) {
        if (err) {
            res.status(500).send('Submission rejected');
            console.log(err.toString());
            return
        }

        var index = global.fifoTarefas.indexOf(id_video);
        if(index > -1) {
            global.fifoTarefas = global.fifoTarefas.splice(index, 1);
        }

        console.log("1 record inserted, ID: " + result.insertId);
        res.status(200).send('Submission accepted');
    });
};

module.exports = new SubmissionTask1();
