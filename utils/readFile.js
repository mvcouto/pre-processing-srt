var fs = require("fs");

function readFile(){}

readFile.prototype.content = function(filePath){
    return fs.readFileSync(filePath, {encoding: 'utf-8'});
};

module.exports = new readFile();
