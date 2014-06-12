CREATE TABLE `player` (
  `uid` varchar(32) NOT NULL,
  `model` varchar(50) NOT NULL DEFAULT '',
  `alive` tinyint(1) NOT NULL DEFAULT '1',
  `queue` smallint(6) NOT NULL DEFAULT '0',
  `items` text NOT NULL,
  `state` text NOT NULL,
  `x` float NOT NULL DEFAULT '0',
  `y` float NOT NULL DEFAULT '0',
  `z` float NOT NULL DEFAULT '0',
  `dir_x` float NOT NULL DEFAULT '0',
  `dir_y` float NOT NULL DEFAULT '0',
  `dir_z` float NOT NULL DEFAULT '0',
  `up_0` int(11) NOT NULL DEFAULT '0',
  `up_1` int(11) NOT NULL DEFAULT '0',
  `up_2` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;