-- phpMyAdmin SQL Dump
-- version 3.5.7
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 03, 2013 at 10:45 PM
-- Server version: 5.5.29-log
-- PHP Version: 5.4.10

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `elabftw`
--

-- --------------------------------------------------------

--
-- Table structure for table `1D_structures`
--

DROP TABLE IF EXISTS `1D_structures`;
CREATE TABLE IF NOT EXISTS `1D_structures` (
  `compound_id` int(11) unsigned NOT NULL,
  `inchi` text COLLATE utf8_bin NOT NULL,
  `smiles` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`compound_id`),
  KEY `compound_id` (`compound_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Compound 1D Structures';

-- --------------------------------------------------------

--
-- Table structure for table `3D_structures`
--

DROP TABLE IF EXISTS `3D_structures`;
CREATE TABLE IF NOT EXISTS `3D_structures` (
  `compound_id` int(11) unsigned NOT NULL,
  `molfile` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`compound_id`),
  KEY `compound_id` (`compound_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Compound 3D Structures';

-- --------------------------------------------------------

--
-- Table structure for table `bin_structures`
--

DROP TABLE IF EXISTS `bin_structures`;
CREATE TABLE IF NOT EXISTS `bin_structures` (
  `compound_id` int(11) unsigned NOT NULL,
  `fp2` blob,
  `obserialized` blob,
  PRIMARY KEY (`compound_id`),
  KEY `compound_id` (`compound_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Compound Binary Structures';

-- --------------------------------------------------------

--
-- Table structure for table `compounds`
--

DROP TABLE IF EXISTS `compounds`;
CREATE TABLE IF NOT EXISTS `compounds` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin NOT NULL,
  `iupac_name` text COLLATE utf8_bin,
  `created` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id_entrant` int(10) unsigned NOT NULL,
  `user_id_registrar` int(10) unsigned DEFAULT NULL,
  `cas_number` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `pubchem_id` int(15) DEFAULT NULL,
  `chemspider_id` int(15) unsigned DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`),
  KEY `id` (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='Compound Library';

-- --------------------------------------------------------

--
-- Table structure for table `compound_properties`
--

DROP TABLE IF EXISTS `compound_properties`;
CREATE TABLE IF NOT EXISTS `compound_properties` (
  `compound_id` int(11) unsigned NOT NULL,
  `mwt` decimal(8,3) unsigned NOT NULL,
  `exact_mass` decimal(10,5) unsigned NOT NULL,
  `clogp` decimal(5,2) NOT NULL,
  `formula` text,
  `num_donor` int(10) unsigned NOT NULL,
  `num_acceptor` int(5) unsigned NOT NULL,
  `num_heavyat` int(5) unsigned NOT NULL,
  `num_rings` int(5) unsigned NOT NULL,
  `num_rot_bond` int(5) unsigned NOT NULL,
  `tot_charge` int(3) NOT NULL,
  `num_atom` int(5) unsigned NOT NULL,
  `num_bond` int(5) unsigned NOT NULL,
  `mol_psa` decimal(10,2) unsigned NOT NULL,
  `is_chiral` int(1) unsigned NOT NULL,
  `density` float unsigned DEFAULT NULL,
  PRIMARY KEY (`compound_id`),
  KEY `compound_id` (`compound_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `experiments`
--

DROP TABLE IF EXISTS `experiments`;
CREATE TABLE IF NOT EXISTS `experiments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `date` int(10) unsigned NOT NULL,
  `status` varchar(255) NOT NULL,
  `links` varchar(255) DEFAULT NULL,
  `userid_creator` int(10) unsigned NOT NULL,
  `userid_closer` int(10) unsigned DEFAULT NULL,
  `userid_witness` int(10) unsigned DEFAULT NULL,
  `elabid` varchar(255) NOT NULL,
  `locked` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `closed` tinyint(1) NOT NULL DEFAULT '0',
  `witnessed` tinyint(1) NOT NULL DEFAULT '0',
  `rev_id` int(10) unsigned DEFAULT NULL,
  `deleted` tinyint(1) unsigned DEFAULT '0',
  `type` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userid_idx` (`userid_creator`),
  KEY `userid_witness_idx` (`userid_witness`),
  KEY `userid_closer_idx` (`userid_closer`),
  KEY `rev_id` (`rev_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `experiments_links`
--

DROP TABLE IF EXISTS `experiments_links`;
CREATE TABLE IF NOT EXISTS `experiments_links` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int(10) unsigned NOT NULL,
  `link_id` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `experiments_tags`
--

DROP TABLE IF EXISTS `experiments_tags`;
CREATE TABLE IF NOT EXISTS `experiments_tags` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tag` varchar(255) NOT NULL,
  `item_id` int(10) unsigned NOT NULL,
  `userid` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userid_idx` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `experiments_templates`
--

DROP TABLE IF EXISTS `experiments_templates`;
CREATE TABLE IF NOT EXISTS `experiments_templates` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `body` text,
  `name` varchar(255) NOT NULL,
  `userid` int(10) unsigned DEFAULT NULL,
  `exp_type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userid_idx` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
CREATE TABLE IF NOT EXISTS `items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `date` int(10) unsigned NOT NULL,
  `body` text,
  `rating` tinyint(10) DEFAULT '0',
  `type` int(10) unsigned NOT NULL,
  `userid` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userid_idx` (`userid`),
  KEY `type_idx` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `items_tags`
--

DROP TABLE IF EXISTS `items_tags`;
CREATE TABLE IF NOT EXISTS `items_tags` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tag` varchar(255) NOT NULL,
  `item_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `item_id_idx` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `items_types`
--

DROP TABLE IF EXISTS `items_types`;
CREATE TABLE IF NOT EXISTS `items_types` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `bgcolor` varchar(6) DEFAULT '000000',
  `template` text,
  `tags` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `reactions`
--

DROP TABLE IF EXISTS `reactions`;
CREATE TABLE IF NOT EXISTS `reactions` (
  `rxn_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `experiment_id` int(10) unsigned NOT NULL,
  `rxn_mdl` longtext CHARACTER SET utf8 NOT NULL,
  `rxn_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`rxn_id`),
  KEY `user_id` (`user_id`,`experiment_id`),
  KEY `experiment_id` (`experiment_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `revisions`
--

DROP TABLE IF EXISTS `revisions`;
CREATE TABLE IF NOT EXISTS `revisions` (
  `rev_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `experiment_id` int(10) unsigned DEFAULT NULL,
  `item_id` int(10) unsigned DEFAULT NULL,
  `rev_notes` varchar(140) DEFAULT NULL,
  `rev_body` text,
  `rev_title` varchar(255) DEFAULT NULL,
  `rev_structure` varchar(45) DEFAULT NULL,
  `rev_links` varchar(255) DEFAULT NULL,
  `rev_timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `rev_reaction_id` int(10) unsigned DEFAULT NULL,
  `rev_stoictab_id` int(10) unsigned DEFAULT NULL,
  `rev_prodtab_id` int(10) unsigned DEFAULT NULL,
  `rev_stoictab_col` blob,
  `rev_prodtab_col` blob,
  PRIMARY KEY (`rev_id`),
  KEY `user_id_idx` (`user_id`),
  KEY `experiment_id_idx` (`experiment_id`),
  KEY `item_id_idx` (`item_id`),
  KEY `rev_reaction_id` (`rev_reaction_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `rxn_product_table`
--

DROP TABLE IF EXISTS `rxn_product_table`;
CREATE TABLE IF NOT EXISTS `rxn_product_table` (
  `id` int(15) unsigned NOT NULL AUTO_INCREMENT,
  `table_rev_id` int(10) unsigned DEFAULT NULL,
  `row_id` int(10) unsigned NOT NULL,
  `exp_id` int(10) unsigned NOT NULL,
  `cpd_name` text,
  `cpd_id` int(11) unsigned DEFAULT NULL,
  `batch_ref` varchar(50) DEFAULT NULL,
  `mwt` decimal(8,3) unsigned DEFAULT NULL,
  `mass` float unsigned DEFAULT NULL,
  `mol` float unsigned DEFAULT NULL,
  `yield` float unsigned DEFAULT NULL,
  `colour` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `notes` text,
  `mass_units` varchar(10) DEFAULT NULL,
  `mol_units` varchar(10) DEFAULT NULL,
  `inchi` text,
  `purity` float unsigned DEFAULT NULL,
  `nmr_ref` varchar(255) DEFAULT NULL,
  `anal_ref1` varchar(255) DEFAULT NULL,
  `anal_ref2` varchar(255) DEFAULT NULL,
  `mpt` float DEFAULT NULL,
  `alphad` float DEFAULT NULL,
  `equiv` float unsigned DEFAULT NULL,
  `columns` blob,
  PRIMARY KEY (`id`),
  KEY `exp_id` (`exp_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `rxn_stoichiometry`
--

DROP TABLE IF EXISTS `rxn_stoichiometry`;
CREATE TABLE IF NOT EXISTS `rxn_stoichiometry` (
  `id` int(15) unsigned NOT NULL AUTO_INCREMENT,
  `table_rev_id` int(10) unsigned DEFAULT NULL,
  `exp_id` int(10) unsigned NOT NULL,
  `row_id` int(4) unsigned NOT NULL,
  `cpd_name` text,
  `cpd_id` int(11) unsigned DEFAULT NULL,
  `cas_number` varchar(20) DEFAULT NULL,
  `cpd_type` varchar(50) DEFAULT NULL,
  `supplier` varchar(50) DEFAULT NULL,
  `batch_ref` varchar(50) DEFAULT NULL,
  `mwt` decimal(8,3) unsigned DEFAULT NULL,
  `mass` float unsigned DEFAULT NULL,
  `vol` float unsigned DEFAULT NULL,
  `mol` float unsigned DEFAULT NULL,
  `density` float unsigned DEFAULT NULL,
  `equiv` decimal(10,0) unsigned DEFAULT '1',
  `limiting` int(1) unsigned NOT NULL DEFAULT '0',
  `notes` text,
  `formula` varchar(50) DEFAULT NULL,
  `conc` float unsigned DEFAULT NULL,
  `weightpercent` float unsigned DEFAULT NULL,
  `mwt_units` varchar(10) DEFAULT NULL,
  `mass_units` varchar(10) DEFAULT NULL,
  `mol_units` varchar(10) DEFAULT NULL,
  `vol_units` varchar(10) DEFAULT NULL,
  `density_units` varchar(10) DEFAULT NULL,
  `conc_units` varchar(10) DEFAULT NULL,
  `inchi` text,
  `solvent` varchar(255) DEFAULT NULL,
  `columns` blob,
  PRIMARY KEY (`id`),
  KEY `rxn_id` (`cpd_id`),
  KEY `cpd_id` (`cpd_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `uploads`
--

DROP TABLE IF EXISTS `uploads`;
CREATE TABLE IF NOT EXISTS `uploads` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `real_name` text NOT NULL,
  `long_name` text NOT NULL,
  `comment` text NOT NULL,
  `item_id` int(10) unsigned DEFAULT NULL,
  `userid` int(10) unsigned NOT NULL,
  `type` varchar(255) NOT NULL,
  `date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userid_idx` (`userid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `userid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(127) DEFAULT NULL,
  `cellphone` varchar(127) DEFAULT NULL,
  `skype` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0',
  `is_jc_resp` tinyint(1) NOT NULL DEFAULT '0',
  `is_pi` tinyint(1) NOT NULL DEFAULT '0',
  `journal` int(11) NOT NULL DEFAULT '0',
  `last_jc` int(4) NOT NULL,
  `register_date` bigint(20) unsigned NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `group` varchar(255) NOT NULL DEFAULT 'user',
  `theme` varchar(30) NOT NULL DEFAULT 'default',
  `display` varchar(10) NOT NULL DEFAULT 'default',
  `order_by` varchar(255) NOT NULL DEFAULT 'date',
  `sort_by` varchar(4) NOT NULL DEFAULT 'desc',
  `limit_nb` tinyint(255) NOT NULL DEFAULT '15',
  `sc_create` varchar(1) NOT NULL DEFAULT 'c',
  `sc_edit` varchar(1) NOT NULL DEFAULT 'e',
  `sc_submit` varchar(1) NOT NULL DEFAULT 's',
  `sc_todo` varchar(1) NOT NULL DEFAULT 't',
  `validated` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`userid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `1D_structures`
--
ALTER TABLE `1D_structures`
  ADD CONSTRAINT `1D_structures_ibfk_1` FOREIGN KEY (`compound_id`) REFERENCES `compounds` (`id`) ON UPDATE NO ACTION;

--
-- Constraints for table `3D_structures`
--
ALTER TABLE `3D_structures`
  ADD CONSTRAINT `3D_structures_ibfk_1` FOREIGN KEY (`compound_id`) REFERENCES `compounds` (`id`) ON UPDATE NO ACTION;

--
-- Constraints for table `bin_structures`
--
ALTER TABLE `bin_structures`
  ADD CONSTRAINT `bin_structures_ibfk_1` FOREIGN KEY (`compound_id`) REFERENCES `compounds` (`id`) ON UPDATE NO ACTION;

--
-- Constraints for table `compound_properties`
--
ALTER TABLE `compound_properties`
  ADD CONSTRAINT `compound_properties_ibfk_1` FOREIGN KEY (`compound_id`) REFERENCES `compounds` (`id`) ON UPDATE NO ACTION;

--
-- Constraints for table `experiments`
--
ALTER TABLE `experiments`
  ADD CONSTRAINT `experiments_ibfk_1` FOREIGN KEY (`userid_creator`) REFERENCES `users` (`userid`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `experiments_ibfk_2` FOREIGN KEY (`userid_closer`) REFERENCES `users` (`userid`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `experiments_ibfk_3` FOREIGN KEY (`userid_witness`) REFERENCES `users` (`userid`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `experiments_ibfk_4` FOREIGN KEY (`rev_id`) REFERENCES `revisions` (`rev_id`);

--
-- Constraints for table `experiments_tags`
--
ALTER TABLE `experiments_tags`
  ADD CONSTRAINT `userid` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON UPDATE NO ACTION;

--
-- Constraints for table `experiments_templates`
--
ALTER TABLE `experiments_templates`
  ADD CONSTRAINT `experiments_templates_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON UPDATE NO ACTION;

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `items_ibfk_2` FOREIGN KEY (`type`) REFERENCES `items_types` (`id`) ON UPDATE NO ACTION;

--
-- Constraints for table `items_tags`
--
ALTER TABLE `items_tags`
  ADD CONSTRAINT `items_tags_ibfk_3` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `reactions`
--
ALTER TABLE `reactions`
  ADD CONSTRAINT `reactions_ibfk_4` FOREIGN KEY (`experiment_id`) REFERENCES `experiments` (`id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `reactions_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`userid`) ON UPDATE NO ACTION;

--
-- Constraints for table `revisions`
--
ALTER TABLE `revisions`
  ADD CONSTRAINT `revisions_ibfk_5` FOREIGN KEY (`rev_reaction_id`) REFERENCES `reactions` (`rxn_id`),
  ADD CONSTRAINT `experiment_id` FOREIGN KEY (`experiment_id`) REFERENCES `experiments` (`id`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `revisions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`userid`) ON UPDATE NO ACTION,
  ADD CONSTRAINT `revisions_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `uploads`
--
ALTER TABLE `uploads`
  ADD CONSTRAINT `uploads_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`userid`) ON UPDATE NO ACTION;

-- ELABFTW
INSERT INTO `items_types` (`id`, `name`, `bgcolor`, `template`, `tags`) VALUES
(1, 'Antibody', '31a700', '<p><strong>Host :</strong></p>\r\n<p><strong>Target :</strong></p>\r\n<p><strong>Dilution to use :</strong></p>\r\n<p>Don''t forget to add the datasheet !</p>', ''),
(2, 'Plasmid', '29AEB9', '<p><strong>Concentration : </strong></p>\r\n<p><strong>Resistances : </strong></p>\r\n<p><strong>Backbone :</strong></p>\r\n<p><strong><br /></strong></p>', ''),
(3, 'siRNA', '0064ff', '<p><strong>Sequence :</strong></p>\r\n<p><strong>Target :</strong></p>\r\n<p><strong>Concentration :</strong></p>\r\n<p><strong>Buffer :</strong></p>', ''),
(4, 'Drugs', 'fd00fe', '<p><strong>Action :</strong> &nbsp;<strong> </strong></p>\r\n<p><strong>Concentration :</strong>&nbsp;</p>\r\n<p><strong>Use at :</strong>&nbsp;</p>\r\n<p><strong>Buffer :</strong> </p>', '');
