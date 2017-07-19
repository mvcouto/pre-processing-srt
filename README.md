# pre-processing-srt

O script de pré-processamento de arquivos SRT é executado por meio do seguinte comando:
node pre-processing-srt.js inglourious-basterds-english

O nome inglourious-basterds-english é uma legenda .srt que está dentro da pasta legends.

Obs: NÃO é necessário colocar a extensão .srt no argumento.

O arquivo gerado é um arquivo chamado inglouriousBasterdsEnglish.sql

Em um banco de dados MySQL ele pode ser importado a partir do seguinte comando:
source C:\(caminho do arquivo)\inglouriousBasterdsEnglish.sql

Para conferir se o script foi adicionado direitinho, é só executar:
select id, start_legend, end_legend from inglouriousBasterdsEnglish; ou
select * from inglouriousBasterdsEnglish; (tanto faz)

O nome da base de dados criada é o nome do arquivo srt passado como argumento em camelcase,
neste caso, o nome da base é: Crowdsourcing

Para consultar as bases de dados, é só executar: select database(); (no prompt do mysql)

Qualquer dúvida: luisaugustomelo@hotmail.com
