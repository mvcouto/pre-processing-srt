var fs = require("fs");

function DB(){}

DB.prototype.createDB = function(name){
    return "DROP DATABASE IF EXISTS " + name + ";\nCREATE DATABASE " + name + ";\n";
};

DB.prototype.useDB = function(name){
    return "use " + name + ";\n\n";
};

DB.prototype.createTableSrtDB = function(name){
    return "CREATE TABLE " + name + "(ID int NOT NULL, start_legend TIME(3) NOT NULL, end_legend TIME(3) NOT NULL, "
    + "legend VARCHAR(255) NOT NULL, PRIMARY KEY (ID));\n\n";
};

DB.prototype.insertSrtDB = function(table, id, start, end, legend){
    legend = legend.replace(new RegExp("\"", 'g'), "\\\"");
    legend = legend.replace(new RegExp("\'", 'g'), "\\\'");
    start = start.replace(",", ".");
    end = end.replace(",", ".");

    return "INSERT INTO " + table + " (ID, start_legend, end_legend, legend) " +
    "VALUES ("+ id + ", \'" + start.replace(" ", "") + "\', \'" + end.replace(" ", "") + "\', \"" + legend + "\");" + "\n\n";
};

module.exports = new DB();
