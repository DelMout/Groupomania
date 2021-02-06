-- Read instructions on READ.ME for seting up the database on MySQL server

CREATE DATABASE groupo CHARACTER SET 'utf8mb4';
USE groupo;

CREATE TABLE users
(
id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,    
nom VARCHAR(255) NOT NULL,
prenom VARCHAR(255) NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
service VARCHAR(255) NOT NULL,
description VARCHAR(255),
password VARCHAR(255) NOT NULL,
last_connect DATE NOT NULL,
photo VARCHAR(255),
isAdmin TINYINT DEFAULT 0
)
ENGINE=INNODB;

CREATE TABLE publications
(
id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,    
titre VARCHAR(255) NOT NULL,
texte_pub TEXT NOT NULL,
photo VARCHAR(255),
date_crea_pub DATE NOT NULL,
userId SMALLINT UNSIGNED NOT NULL,
CONSTRAINT fk_userId_pub FOREIGN KEY (userId) REFERENCES users(id)
ON DELETE CASCADE
ON UPDATE CASCADE
)
ENGINE=INNODB;

CREATE TABLE comments
(
id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,    
texte_com TEXT NOT NULL,
date_crea_com DATE NOT NULL,
userId SMALLINT UNSIGNED NOT NULL,
publicationId SMALLINT UNSIGNED NOT NULL,
CONSTRAINT fk_userId_com FOREIGN KEY (userId) REFERENCES users(id)
ON DELETE CASCADE
ON UPDATE CASCADE,
CONSTRAINT fk_pubId FOREIGN KEY (publicationId) REFERENCES publications(id)
ON DELETE CASCADE
ON UPDATE CASCADE
)
ENGINE=INNODB;

CREATE TABLE likes
(
id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,    
userId SMALLINT UNSIGNED NOT NULL,
publicationId SMALLINT UNSIGNED NOT NULL,
CONSTRAINT fk_userId_like FOREIGN KEY (userId) REFERENCES users(id)
ON DELETE CASCADE
ON UPDATE CASCADE,
CONSTRAINT fk_pubId_like FOREIGN KEY (publicationId) REFERENCES publications(id)
ON DELETE CASCADE
ON UPDATE CASCADE
)
ENGINE=INNODB;

