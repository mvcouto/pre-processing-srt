CREATE TABLE submissions_t1 (
id int NOT NULL AUTO_INCREMENT,
id_video int NOT NULL,
begin_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
end_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
answer VARCHAR(200) NOT NULL,
fingerprint VARCHAR(200) NOT NULL,
PRIMARY KEY (id));
