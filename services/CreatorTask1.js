function CreatorTask1(){}


CreatorTask1.prototype.getItemId = function(db_conn, res) {
    var sql_where = "";
    for(var i=0; i < global.fifoTarefaEnviada.length; i++){
        if(i == 0){
            sql_where += "WHERE a.id != " + global.fifoTarefaEnviada[i];
        }else{
            sql_where += " AND a.id != " + global.fifoTarefaEnviada[i];
        }

    }

    var sql = 'SELECT a.id FROM task1 AS a LEFT JOIN task1submissions AS b ON a.id = b.id_video ' + sql_where +
        ' GROUP BY a.id ORDER BY COUNT(a.id) ASC LIMIT 1;';

    db_conn.query(sql, function (err, result) {
        if (err) {
            res.status(404).send('Item not found 2');
            console.log(err.toString());
            return
        }

        if(result.length < 1) {
            res.status(404).send('Item not found')
        } else {
            var task_description = {};
            task_description.id_video = result[0].id.toString();
            res.contentType('application/json').status(200).send(JSON.stringify(task_description));

            global.fifoTarefaEnviada.push(result[0].id.toString());
        }
    });
};

module.exports = new CreatorTask1();