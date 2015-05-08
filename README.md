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
* DevWebsite VARCHAR(512) UNIQUE: the developer's website URL. Should be prefixed with http:// in order for links in the webapp to work properly, but if it's omitted, the web app will add it before it gets sent to the database.

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

# Web app

* `/` A basic homepage that presents the user with links to view the Games, Users, and Developers tables (the strong entities)

**Games**
* `/games` Games catalog. Presents a table with basic information on each game in the Games table. It also allows the user to add a new game to the catalog.
* `/games/view` Clicking on a game title in the catalog will bring the user to a page displaying more detailed information on the game and any DLC it may have. It also presents options to edit or delete this game, or add DLC to it. Clicking on a DLC item will allow the user to edit or delete that DLC item.
* `/games/add` This presents the user with a form for adding a new game to the catalog. When the user clicks Submit, the data in the form is sent to `/games/insert`.
* `/games/insert` The information entered in the form in `/games/add` is sent here when the user clicks Submit, which is then inserted into the database. Upon successful insertion, the user is presented with an option to add DLC to the newly created game, or return to the catalog.
* `/games/edit` A form for editing information on a game, which is initially populated with the game's current values.
* `/games/update` The updated data from the form in `/games/edit` is sent here to be inserted into the database.
* `/games/delete` Deletes the specified game from the database

**DLC**
* `/dlc/add` Form for adding new DLC to a specified game.
* `/dlc/insert` Form data in `/dlc/add` is sent here to be submitted to the database.
* `/dlc/edit` Form for editing information for a certain DLC.
* `/dlc/update` Form data in `/dlc/edit` is sent here to be submitted to the database.
* `/dlc/delete` Deletes the specified DLC from the database.

**Users**
* `/users` Lists all users, their email address, and their current status. Clicking on a username will bring up more detailed information. Also presents a link for a new user to sign up.
* `/users/view` Presents more detailed information on a user. Thier online status is displayed here and can be changed; the list of games they own is displayed, and games can be added or removed from their library here; thier friends list is displayed and friends can be added and removed; and finally, the user's profile can be edited or deleted.
* `/users/add` Signup form for new users; asks for their desired username, their email address, and the account's password.
* `/users/insert` Form data from `/users/add` is sent here to be submitted to the database. Upon successful submission, the user is presented with an option to view their newly created profile.
* `/users/edit` Form for editing a user's profile.
* `/users/update` Form data from `/users/edit` is sent here to be submitted to the database.
* `/users/status/edit` Form for updating a user's status. Presents three options: Offline, Online, and Away. If I was more Javascript savvy I would include an option for a custom status as well.
* `/users/status/update` Updates the user's status with the option chosen in `/users/status/edit`
* `/users/delete` Deletes the specified user's profile.

**Friend requests**
* `/friendreq/add` Presents a list of users that does not include the user making the friend request. People that the user is already friends with are also excluded.
* `/friendreq/submit` The user chosen in `/friendreq/add` is now friends with the user making the request, whether they want to or not.
* `/friendreq/del` Fortunately removing a friend is just as trivial, so if a user decides he no longer wants to be friends with someone, he can be removed from the friends list here.

**Game library**
* `/addgame/add` Presents the user with a list of games to be added to their library. Does not include games that the user already owns.
* `/addgame/submit` Adds the selected game to the user's library
* `/addgame/del` Deletes the selected game from the user's library

**Developers**
* `/devs` Displays all developers. Click a developer's name to view more info on them.
* `/devs/view` More info on a developer. Lists all games that this dev has worked on.
* `/devs/add` Form for adding a new developer. DevWebsite should be prefixed with http:// in order for links to work properly, but if it's omitted it will get added before it gets sent to the database.
* `/devs/insert` Inserts form data from `/devs/add` to the database. If DevWebsite is not prefixed with http:// it will be added before it gets inserted.
* `/devs/edit` Form for editing a developer's information.
* `/devs/update` Submits the updated data from `/dev/edit` to the database.
* `/dev/delete` Deletes the specified developer.
