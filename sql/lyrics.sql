CREATE DATABASE IF NOT EXISTS `operadb`;
USE `operadb`;

CREATE TABLE IF NOT EXISTS `lyrics` (
  `operaId`        char(8)     NOT NULL,
  `id`             int(11)     NOT NULL  AUTO_INCREMENT,
  `speakerName`    char(255)   NOT NULL,
  `lyricContent`   text        NOT NULL,
  `speakType`      char(50)    NOT NULL,
  `speakerCount`   int(11)     NOT NULL,
  `lyricIndex`     int(11)     NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
