function SubmissionTask2(){}

SubmissionTask2.prototype.insertSubmission = function(res, db_conn, id_legenda, fingerprint) {
    var sql = "INSERT INTO task2submissions (id_legenda, fingerprint) VALUES ("
        + "'" + id_legenda + "', "
        + "'" + fingerprint + "');";

    db_conn.query(sql, function (err, result) {
        if (err) {
            res.status(500).send('Submission rejected');
            console.log(err.toString());
            return
        }

        console.log("1 record inserted, ID: " + result.insertId);
        res.status(200).send('Submission accepted');
    });
};

module.exports = new SubmissionTask2();
