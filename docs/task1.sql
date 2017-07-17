DROP DATABASE IF EXISTS crowdsub;
CREATE DATABASE crowdsub;
use crowdsub;

CREATE TABLE task1(id int NOT NULL, start_legend TIME(3) NOT NULL, end_legend TIME(3) NOT NULL, legend VARCHAR(255) NOT NULL, PRIMARY KEY (id));

INSERT INTO task1 (ID, start_legend, end_legend, legend) VALUES (33, '00:09:32.622', '00:09:34.289', "and the Dreyfuses.");

INSERT INTO task1 (ID, start_legend, end_legend, legend) VALUES (34, '00:09:34.457', '00:09:35.999', "Is that correct?");

INSERT INTO task1 (ID, start_legend, end_legend, legend) VALUES (35, '00:09:36.084', '00:09:37.084', "To my knowledge,");

INSERT INTO task1 (ID, start_legend, end_legend, legend) VALUES (36, '00:09:37.168', '00:09:40.629', "those were the Jewish families among the dairy farmers.");

INSERT INTO task1 (ID, start_legend, end_legend, legend) VALUES (37, '00:09:40.797', '00:09:44.633', "Herr Colonel, would it disturb you if I smoked my pipe?");


