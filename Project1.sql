USE Project1;
DROP TABLE IF EXISTS Friends_List,Game_Library,Users,Platforms,DLC,Games,Developers;

CREATE TABLE Games(	GameID INT PRIMARY KEY AUTO_INCREMENT, 
					GameName VARCHAR(255) UNIQUE, 
					Price INT,
					Genre VARCHAR(255),
					ReleaseDate DATE,
					Rating VARCHAR(4));

CREATE TABLE DLC(	GameID INT NOT NULL,
					DLCPrice INT,
					DLCName VARCHAR(255),
					DLCReleaseDate DATE,
					FOREIGN KEY (GameID) REFERENCES Games(GameID),
					CONSTRAINT UNIQUE(GameID,DLCName));
CREATE TABLE Platforms(	GameID INT NOT NULL,
						Platform VARCHAR(255),
						CONSTRAINT UNIQUE (GameID,Platform),
						FOREIGN KEY (GameID) REFERENCES Games(GameID));

CREATE TABLE Developers(	DevID INT PRIMARY KEY AUTO_INCREMENT,
							DevName VARCHAR(255) UNIQUE,
							DevWebsite VARCHAR(255) UNIQUE);
ALTER TABLE Games ADD DevelopedBy INT;
ALTER TABLE Games ADD FOREIGN KEY (DevelopedBy) REFERENCES Developers(DevID);

CREATE TABLE Users(	UserID INT PRIMARY KEY AUTO_INCREMENT,
					UserName VARCHAR(255) UNIQUE,
					UserEmail VARCHAR(255) UNIQUE,
					UserPass VARCHAR(255),
					UserStatus VARCHAR(255) DEFAULT 'Offline');
CREATE TABLE Friends_List(	UserID INT,
							FriendID INT,
							FOREIGN KEY (UserID) REFERENCES Users(UserID),
							FOREIGN KEY (FriendID) REFERENCES Users(UserID),
							CONSTRAINT UNIQUE (UserID,FriendID));
CREATE TABLE Game_Library(	UserID INT,
							GameID INT,
							FOREIGN KEY (UserID) REFERENCES Users(UserID),
							FOREIGN KEY (GameID) REFERENCES Games(GameID),
							CONSTRAINT UNIQUE (UserID,GameID));
INSERT INTO Users(UserName, UserEmail, UserPass) VALUES
	('PC Elitist 1','pcmr@gmail.com','x'),
	('PC Elitist 2','nvidiaftw@gmail.com','x'),
	('xX|c0ns0l3_p34s4nt360|Xx','xboxfan@hotmail.com','x'),
	('CasualGamer53','casualgamer53@yahoo.com','x');
INSERT INTO Friends_List(UserID,FriendID) VALUES(1,2),(2,1),
	(1,3),(3,1),
	(3,4),(4,3);
-- User 1's friends
SELECT UserName,UserStatus FROM Friends_List RIGHT JOIN Users ON Friends_List.FriendID = Users.UserID WHERE Friends_List.UserID=1;

-- Populate Developers
INSERT INTO Developers(DevName,DevWebsite) VALUES ('Valve Corporation','www.valvesoftware.com'),
	('Telltale Games','www.telltalegames.com'),
	('Bethesda Softworks','www.bethsoft.com'),
	('Activision','www.activision.com'),
	('Popcap Games','www.popcap.com'),
	('Squad','http://www.squad.com.mx/');

-- Populate Games
INSERT INTO Games(GameName,Price,Genre,ReleaseDate,Rating,DevelopedBy) VALUES(
	'Half-Life',10,'First-person shooter',1998-11-08,'M',1);
INSERT INTO Games(GameName,Price,Genre,ReleaseDate,Rating,DevelopedBy) VALUES
	('Half-Life 2',10,'First-person shooter','2004-11-16','M',1),
	('Portal',7,'Puzzle','2007-10-10','T',1),
	('The Walking Dead',15,'Point-and-click adventure','2012-04-24','M',2),
	('Fallout 3',10,'First-person shooter/RPG','2008-10-28','M',3),
	('Fallout: New Vegas',20,'First-person shooter/RPG','2010-10-19','M',3),
	('The Elder Scrolls V: Skyrim',30,'Fantasy RPG','2011-11-11','M',3);
INSERT INTO Games(GameName,Price,Genre,ReleaseDate,Rating,DevelopedBy) VALUES
	('Call of Duty 4: Modern Warfare',60,'First-person shooter','2007-11-5','M',4),
	('Call of Duty: World at War',60,'First-person shooter','2008-11-11','M',4),
	('Call of Duty: Modern Warfare 2',60,'First-person shooter','2009-11-10','M',4),
	('Call of Duty: Black Ops',60,'First-person shooter','2010-11-09','M',4),
	('Call of Duty: Modern Warfare 3',60,'First-person shooter','2011-11-08','M',4),
	('Call of Duty: Black Ops 2',60,'First-person shooter','2012-11-12','M',4),
	('Call of Duty: Ghosts',70,'First-person shooter','2013-11-5','M',4),
	('Call of Duty: Advanced Warface',70,'First-person shooter','2014-11-3','M',4);
INSERT INTO Games(GameName,Price,Genre,ReleaseDate,Rating,DevelopedBy) VALUES
	('Peggle',5,'Puzzle','2007-02-27','E',5);
INSERT INTO Games(GameName,Price,Genre,ReleaseDate,Rating,DevelopedBy) VALUES
	('Kerbal Space Program',30,'Spaceflight simulator','2011-06-24','E',6);

-- Populate game libraries
-- User derp has Peggle and Skyrim
INSERT INTO Game_Library VALUES(1,16),(1,7);
-- Console peasant has nothing but CoD games
INSERT INTO Game_Library VALUES(2,8),(2,9),(2,10),(2,11),(2,12),(2,13),(2,14),(2,15);
-- PC Elitist 1 is a Valve fanboy and has nothing but Valve games
INSERT INTO Game_Library VALUES(3,1),(3,2),(3,3);
-- PC Elitist 2 prefers RPGs
INSERT INTO Game_Library VALUES(4,4),(4,5),(4,6),(4,7),(4,17);
-- Select PC Elitist 2's games
SELECT UserName,GameName,Genre FROM Game_Library 
	RIGHT JOIN Games ON Game_Library.GameID = Games.GameID 
	LEFT JOIN Users ON Game_Library.UserID = Users.UserID 
	WHERE Game_Library.UserID=4;

-- Populate Platforms
-- HL, HL2, Portal
INSERT INTO Platforms VALUES(1,'Windows'),(1,'Mac'),(1,'Linux');
INSERT INTO Platforms VALUES(2,'Windows'),(2,'Mac'),(2,'Linux'),(3,'Windows'),(3,'Mac'),(3,'Linux');
-- TWD
INSERT INTO Platforms VALUES(4,'Windows'),(4,'Mac');
-- FO3, New Vegas, Skyrim - Windows exclusive
INSERT INTO Platforms values(5,'Windows'),(6,'Windows'),(7,'Windows');
-- The monstrosity that is Call of Duty
INSERT INTO Platforms values
	(8,'Windows'),(8,'Xbox'),(8,'Playstation'),
	(9,'Windows'),(9,'Xbox'),(9,'Playstation'),
	(10,'Windows'),(10,'Xbox'),(10,'Playstation'),
	(11,'Windows'),(11,'Xbox'),(11,'Playstation'),
	(12,'Windows'),(12,'Xbox'),(12,'Playstation'),
	(13,'Windows'),(13,'Xbox'),(13,'Playstation'),
	(14,'Windows'),(14,'Xbox'),(14,'Playstation'),
	(15,'Windows'),(15,'Xbox'),(15,'Playstation');
-- Peggle
INSERT INTO Platforms VALUES(16,'Windows'),(16,'Mac');
-- KSP
INSERT INTO Platforms VALUES(17,'Windows'),(17,'Mac'),(17,'Linux');

-- Populate DLC (only doing it for FO3, NV, and Skyrim, because I know them off the top of my head and I can't be arsed to go through all the DLC for CoD
INSERT INTO DLC VALUES
	(5,5,'Operation: Anchorage','2009-01-27'),
	(5,5,'The Pitt','2009-03-24'),
	(5,5,'Broken Steel','2009-05-05'),
	(5,5,'Point Lookout','2009-06-23'),
	(5,5,'Mothership Zeta','2009-08-03');
INSERT INTO DLC values
	(6,10,'Dead Money','2011-02-22'),
	(6,10,'Honest Hearts','2011-05-17'),
	(6,10,'Old World Blues','2011-07-19'),
	(6,10,'Lonesome Road','2011-09-20');
INSERT INTO DLC values
	(6,5,'Gun Runner`s Arsenal','2011-09-27');
INSERT INTO DLC VALUES 
	(6,5,'Courier`s Stash','2011-09-27');
INSERT INTO DLC VALUES
	(7,15,'Dawnguard','2012-08-02'),
	(7,5,'Hearthfire','2012-10-04'),
	(7,15,'Dragonborn','2013-02-05');
SELECT * FROM DLC JOIN Games ON DLC.GameID = Games.GameID;
