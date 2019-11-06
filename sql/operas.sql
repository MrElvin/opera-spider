CREATE DATABASE IF NOT EXISTS `operadb`;
USE `operadb`;

CREATE TABLE IF NOT EXISTS `operas` (
  `operaId`        char(8)     NOT NULL,
  `operaName`      char(50)    NOT NULL,
  `operaPeriod`    char(50)    NOT NULL,
  `operaSource`    text        NULL,
  `operaBrief`     text        NULL,
  `operaComment`   text        NULL,
  PRIMARY KEY (`operaId`, `operaPeriod`)
) ENGINE=InnoDB;
