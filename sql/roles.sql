CREATE DATABASE IF NOT EXISTS `operadb`;
USE `operadb`;

CREATE TABLE IF NOT EXISTS `roles` (
  `roleName`           char(50)     NOT NULL,
  `operaRoleName`      char(8)      NOT NULL,
  `operaId`            TEXT         NOT NULL,
  `id`                 int(11)      NOT NULL  AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
