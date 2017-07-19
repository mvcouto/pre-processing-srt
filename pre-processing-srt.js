//Exemplo de comando de entrada: node pre-processing-srt.js inglourious-basterds-english
var fs = require("fs");
var readFile = require("./utils/readFile");
var DBSrt = require("./utils/createDB");
var spawn = require('child_process').spawn;
var moment = require('moment');
var os = require('os');
// exemplo: ffmpeg -i ./videos/aula.mp4 -ss 00:01:02.500 -t 00:00:00.250 -c copy -sn ./videos/1.mp4 -y

//Realiza a operação de calcular a diferença entre o tempo inicial e o tempo final para cada legenda.
function getDuration(start, end){
	var splitStart = new moment(start, 'HH:mm:ss.SSS');
	var splitEnd = new moment(end, 'HH:mm:ss.SSS');
	var current = moment.duration(splitEnd.diff(splitStart));

	return current.hours() + ":" + current.minutes() + ":" + current.seconds() + "." + current.milliseconds();
}

/*Constrói um array de parametros para partir o vídeo em N pedaços, onde N é o número de identificadores de legendas do vídeo.
** Os parametros de entrada é o nome do vídeo (o vídeo deve ter o mesmo nome da legenda e é passado como parametro de entrada)
** Tempo inicial, tempo final e o id (representa o arquivo criado .mp4 ex: 1.mp4, 2.mp4 e assim por diante).
*/
function buildSpawnParams(video, start, end, id){
	var params = [];
	params.push('-i', './videos/'+video+'.mp4', '-ss', start.replace(" ", ""), '-t', getDuration(start,end), '-c', 'copy', '-sn', './videos/'+id.replace('\n', "")+'.mp4', '-y');
	return params;
}

//Função para botar o nome do arquivo em Camelcase
function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s+/g, '');
}

//https://stackoverflow.com/questions/650022/how-do-i-split-a-string-with-multiple-separators-in-javascript
//Da um split no arquivo inteiro e separa cada posição do vetor como sendo 1 tempo de legenda
try{ 
	var arr = readFile.content("legends/" + process.argv.slice(2)[0] + ".srt").split(/\n\r|\n\n/).map(val => val);
}
catch(err){
	//Caso não seja possível ler o arquivo de entrada, finaliza o processo.
	console.log("\nArquivo não existente no diretório legends.\n");
	process.exit();
}


//Cria a base de dados.
var file = DBSrt.createDB("Crowdsourcing");
//Usa a base de dados.
file += DBSrt.useDB("Crowdsourcing");
//Cria a tabela na base de dados com o nome passado como parametro de entrada camelizado.
file += DBSrt.createTableSrtDB(camelize(process.argv.slice(2)[0]).replace(new RegExp("-", 'g'), ""));

//Realiza iteração em cada legenda do vídeo.
for (i = 0; i < arr.length-1; i++){
    //Da um split em cada tempo de legenda separando os campos.

    if(os.type() == 'Linux'){
        try{
            var arr2 = arr[i].split(/:\n:/);
            //Da um split no campo de tempo de reprodução do arquivo SRT para remover o -->.
            var arr3 = arr2[1].split("-->");

            //Muda as virgulas por pontos no tempo de cada legenda.
            arr3[0] = arr3[0].replace(",", ".");
            arr3[1] = arr3[1].replace(",", ".");
        }
        catch(err){
            var arr2 = arr[i].split(/\r\n/);
            //Da um split no campo de tempo de reprodução do arquivo SRT para remover o -->.
            var arr3 = arr2[1].split("-->");

            //Muda as virgulas por pontos no tempo de cada legenda.
            arr3[0] = arr3[0].replace(",", ".");
            arr3[1] = arr3[1].replace(",", ".");
        }
    }
    

    //Realiza o particionamento do vídeo em N partes.
    spawn('ffmpeg', buildSpawnParams(process.argv.slice(2)[0], arr3[0],arr3[1], arr2[0]));

    //Caso o tempo de reprodução tenha mais de uma linha de legenda.
    if(arr2.length > 3){
        legend = "";
        for (j = 2; j < arr2.length; j++){
            if(j != arr2.length-1)
                legend += arr2[j] + " ";
            else
                legend += arr2[j];
        }
        file += DBSrt.insertSrtDB(camelize(process.argv.slice(2)[0]).replace(new RegExp("-", 'g'), ""), arr2[0], arr3[0], arr3[1], legend);
    }
    //Caso o tempo de reprodução tenha apenas uma linha de legenda.
    else{
        file += DBSrt.insertSrtDB(camelize(process.argv.slice(2)[0]).replace(new RegExp("-", 'g'), ""), arr2[0], arr3[0], arr3[1], arr2[2]);
    }
}

//Escreve no arquivo com o nome do parametro passado como parametro camelizado .sql
fs.writeFile(camelize(process.argv.slice(2)[0]).replace(new RegExp("-", 'g'), "")+'.sql', file, function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});
