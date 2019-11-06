CREATE DATABASE IF NOT EXISTS `operadb`;
USE `operadb`;

CREATE TABLE IF NOT EXISTS `operas` (
  `operaId`        char(8)     NOT NULL,
  `operaName`      char(50)    NOT NULL,
  `operaPeriod`    char(50)    NOT NULL,
  `operaSource`    text        NULL,
  `operaBrief`     text        NULL,
  `operaComment`   text        NULL,
  `operaBook`      char(50)    NULL,
  `operaTopic`     ENUM('儿女缠绵', '世俗生活', '政治斗争', '军事风云', '神话传说', '草莽英雄')    NULL,
  PRIMARY KEY (`operaId`, `operaPeriod`)
) ENGINE=InnoDB;
