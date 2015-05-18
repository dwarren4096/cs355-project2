DROP VIEW IF EXISTS GamesIndex;
CREATE VIEW GamesIndex AS
	SELECT * FROM Games JOIN Developers ON Developers.DevID = Games.DevelopedBy
	ORDER BY GameName ASC;

SELECT GameID, GameName, DevName FROM GamesIndex;

DROP VIEW IF EXISTS GamesDetail;
CREATE VIEW GamesDetail AS
	SELECT Games.GameID, GameName, Price, Genre, ReleaseDate, Rating,
	DLCName, DLCPrice, DLCReleaseDate, 
	DevID, DevName FROM Games
	JOIN Developers ON Developers.DevID = Games.DevelopedBy
	LEFT JOIN DLC ON DLC.GameID=Games.GameID;

SELECT * FROM GamesDetail WHERE GameID=7;

DELIMITER |$
CREATE FUNCTION GamesDeveloped(DevID INT) RETURNS INT deterministic
begin
	DECLARE numGames INT;
	SET numGames = (SELECT COUNT(*) FROM Games WHERE DevelopedBy=DevID);
	RETURN (numGames);
END

SELECT GameID, GameName, GamesDeveloped(1) FROM Games WHERE DevelopedBy=1;