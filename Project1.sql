USE Project1;
DROP TABLE IF EXISTS Friends_List,Game_Library,Users,DLC,Games,Developers;

CREATE TABLE Games(	GameID INT PRIMARY KEY AUTO_INCREMENT, 
					GameName VARCHAR(512) UNIQUE, 
					Price INT NOT NULL DEFAULT 0,
					Genre VARCHAR(255),
					ReleaseDate DATE,
					Rating VARCHAR(4),
					DevelopedBy INT NOT NULL,
					FOREIGN KEY (DevelopedBy) REFERENCES Developers(DevID));

CREATE TABLE DLC(	GameID INT NOT NULL,
					DLCPrice INT NOT NULL DEFAULT 0,
					DLCName VARCHAR(512) NOT NULL,
					DLCReleaseDate DATE,
					FOREIGN KEY (GameID) REFERENCES Games(GameID),
					CONSTRAINT UNIQUE(GameID,DLCName));

CREATE TABLE Developers(	DevID INT PRIMARY KEY AUTO_INCREMENT,
							DevName VARCHAR(512) UNIQUE NOT NULL,
							DevWebsite VARCHAR(512) UNIQUE NOT NULL);

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

-- Populate Users
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
	('Telltale Games','http://www.telltalegames.com'),
	('Bethesda Softworks','http://www.bethsoft.com'),
	('Activision','http://www.activision.com'),
	('Popcap Games','http://www.popcap.com'),
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
-- CasualGamer has Peggle and Skyrim
INSERT INTO Game_Library VALUES(4,16),(4,7);
-- Console peasant has nothing but CoD games
INSERT INTO Game_Library VALUES(3,8),(3,9),(3,10),(3,11),(3,12),(3,13),(3,14),(3,15);
-- PC Elitist 1 is a Valve fanboy and has nothing but Valve games
INSERT INTO Game_Library VALUES(1,1),(1,2),(1,3);
-- PC Elitist 2 prefers RPGs
INSERT INTO Game_Library VALUES(2,4),(2,5),(2,6),(2,7),(2,17);
-- Select PC Elitist 2's games
SELECT UserName,GameName,Genre FROM Game_Library 
	RIGHT JOIN Games ON Game_Library.GameID = Games.GameID 
	LEFT JOIN Users ON Game_Library.UserID = Users.UserID 
	WHERE Game_Library.UserID=2;

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
