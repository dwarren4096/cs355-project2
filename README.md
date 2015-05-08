# CS355: Project 1  
**By Derek Warren**

The Gauge Corporation, headed up by Nebe Gawell, has devised a plan to introduce a new digital distribution platform for video games. Dubbed "Vapor", this new system is expected to revolutionize the marketplace by allowing gamers to easily purchase games at heavily discounted prices (and is not to be confused with the third installment of a certain video game series that takes its title from a property of radioactivity).

#Tables

**Games**  
This table holds, as its name implies, information on the games that are available for purchase.
* GameID INT PRIMARY KEY AUTO_INCREMENT: A unique identifier for each game.
* GameName VARCHAR(512) UNIQUE: The game's title. While unique, integers are easier to deal with than strings and less prone to SQL injections, hence the presence of GameID.
* Price INT: The game's price. Useful to know if you plan on purchasing this game.
* Genre VARCHAR(255): The game's genre, e.g. Shooter, Puzzle, Adventure, etc.
* ReleaseDate DATE: The day this game was released. This field's a bit finicky; it should be inserted with the format yyyy-mm-dd. It also adds a time of 00:00:00 (12:00 midnight exactly), even though this datatype is supposed to only hold dates.
* Rating VARCHAR(4): The game's rating. The web page presents the following options (although technically any four-character combination is allowed): Everyone (E), Teen (T), Mature (M), No Rating (NR, usually appears on indie games that aren't subject to a formal rating).
* DevelopedBy INT NOT NULL, FOREIGN KEY (DevelopedBy) REFERENCES Developers(DevID)): Who developed this game. A foreign key referring to a developer's DevID. Cannot be null; every game needs a dev.

**DLC**  
A weak entity belonging to Games. Lists additional content for a game that can be purchased separately.
* GameID INT NOT NULL: A foreign key corresponding to the game this DLC item belongs to. Cannot be null, all DLC must belong to a game.
* DLCName VARCHAR(512) NOT NULL: The name of this DLC. Part of a combined primary key with GameID.
* DLCPrice INT: Price of the DLC.
* DLCReleaseDate: DLC's release date. Follows the same format as a Game's release date.

**Developers**  
The developers responsible for bringing such fine pieces of entertainment to the masses.
* DevID INT PRIMARY KEY AUTO_INCREMENT: A unique identifier for each developer.
* DevName VARCHAR(512) UNIQUE: the developer's name
* DevWebsite VARCHAR(512) UNIQUE: the developer's website

**Users**  
Holds information on users.
* UserID INT PRIMARY KEY AUTO_INCREMENT: A unique identifier for the user.
* UserName VARCHAR(255) UNIQUE: username displayed to other users
* UserPass VARCHAR(255): password for the user account
* UserEmail VARCHAR(255) UNIQUE: user's email address
* UserStatus VARCHAR(255) DEFAULT 'Offline': Status displayed to other users. Can technically be anything, but the form only presents 'Online', 'Offline', and 'Away'.

**Friends_List**  
A lookup table keeping track of what users are friends with other users. A friend relationship is reciprocal, so adding a friend involves inserting two rows with opposite values.
* UserID INT: Foreign key corresponding to Users.UserID.
* FriendID INT: Foreign key corresponding to a different UserID. 

**Game_Library**
A lookup table keeping track of what users own what games.
* UserID INT: foreign key corresponding to Users.UserID.
* GameID INT: foreign key corresponding to Games.GameID.
