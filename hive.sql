CREATE TABLE `dropped_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `imp` int(11) NOT NULL,
  `mt` varchar(100) NOT NULL,
  `time_added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

CREATE TABLE `player` (
  `uid` varchar(32) NOT NULL,
  `model` varchar(50) NOT NULL DEFAULT '',
  `alive` tinyint(1) NOT NULL DEFAULT '1',
  `queue` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `items` text NOT NULL,
  `state` text NOT NULL,
  `time_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `time_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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