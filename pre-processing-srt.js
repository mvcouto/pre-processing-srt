var fs = require("fs");
var readFile = require("./utils/readFile");
var DBSrt = require("./utils/createDB");

//Função para botar o nome do arquivo em camelcase
function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

//Da um split no arquivo inteiro e separa cada posição do vetor como sendo 1 tempo de legenda
var arr = readFile.content("legends/" + process.argv.slice(2)[0] + ".srt").split("\n\r\n").map(val => val);

var file = DBSrt.createDB(camelize(process.argv.slice(2)[0]).replace(new RegExp("-", 'g'), ""));
file += DBSrt.useDB(camelize(process.argv.slice(2)[0]).replace(new RegExp("-", 'g'), ""));
file += DBSrt.createTableSrtDB("SRT");

for (i = 0; i < arr.length-1; i++){
    //Da um split em cada tempo de legenda separando os campos.
    var arr2 = arr[i].split("\r\n");
    //Da um split no campo de tempo de reprodução do arquivo SRT para remover o -->.
    var arr3 = arr2[1].split("-->");

    //Caso o tempo de reprodução tenha mais de uma linha de legenda.
    if(arr2.length > 3){
        legend = "";
        for (j = 2; j < arr2.length; j++){
            if(j != arr2.length-1)
                legend += arr2[j] + " ";
            else
                legend += arr2[j];
        }
        file += DBSrt.insertSrtDB("SRT", arr2[0], arr3[0], arr3[1], legend);
    }
    //Caso o tempo de reprodução tenha apenas uma linha de legenda.
    else{
        file += DBSrt.insertSrtDB("SRT", arr2[0], arr3[0], arr3[1], arr2[2]);
    }
}

fs.writeFile('mysql.sql', file, function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});
