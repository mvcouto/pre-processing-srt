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
            res.status(500).send('Submissão rejeitada');
            throw err;
        }

        console.log("1 record inserted, ID: " + result.insertId);
        res.status(200).send('Submissão aceita');
    });
};

module.exports = new SubmissionTask2();
