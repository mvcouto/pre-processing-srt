function SubmissionTask1(){}

SubmissionTask1.prototype.insertSubmission = function(db_conn, id_task, begin_time, end_time, answer) {
    var sql = "INSERT INTO submissions_t1 (id_video, begin_time, end_time, answer, fingerprint) VALUES ("
        + id_video + ", "
        + "'" + begin_time + "', "
        + "'" + end_time + "', "
	+ "'" + answer + "', "
        + "'" + fingerprint + "');"
   
    console.log(sql)

    db_conn.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted, ID: " + result.insertId);
    });
}

module.exports = new SubmissionTask1();
