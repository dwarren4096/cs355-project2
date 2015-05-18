DROP VIEW IF EXISTS GamesIndex;
CREATE VIEW GamesIndex AS
	SELECT * FROM Games JOIN Developers ON Developers.DevID = Games.DevelopedBy
	ORDER BY GameName ASC;

SELECT GameID, GameName, DevName FROM GamesIndex;

-- sick of the Call of Duty joke
DELETE FROM Games WHERE GameID > 8 AND GameID < 16;