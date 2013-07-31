Super Mario World: Impact.js
----------------------------

Super Mario World: Impact.js aims to recreate the original Super
Mario World (SMW) platformer from the Super Nintendo (SNES) using
JavaScript, HTML5 and CSS. Impact.js is a game engine which is ideal
for games involving 2D graphics, side-scrolling, collisions and it 
comes with its own level editor, Weltmeister. 

This project also aims to be a foundation for a potential project 
for the CCNY Association of Computing Machinery (ACM) Game Development
Special Interest Group(SIG). 

###Installation
In order to run this game, you will need a copy of the Impact.js library,
which can be purchased for 99$ here: <http://impactjs.com/buy-impact/>

In order to use the built-in Tile Editor Weltmeister, you will need to
make sure that Apache and PHP are running on your machine. Some helpful
links are provided below for assistance in setting up PHP, MySQL and Apache:

Mac OS:

     <http://php.about.com/od/phpbasics/ss/installMac.html>

Windows: 
    
    <http://lifeofageekadmin.com/how-install-apache-2-4-php-5-4-and-mysql-5-5-21-on-windows-7/>

For simpler installation, there are one-step solutions known as MAMP (for Macs)
and XAMPP. These programs allow you to easily enable a web-server which has MySQL
and PHP up and ready to go. Follow the links below to find these programs:

MAMP (Mac OS):

    <http://www.mamp.info/en/index.html> 

XAMPP (Windows):
    
    <http://www.apachefriends.org/en/xampp.html>

If you are not using MAMP/XAMPP and prefer to enable PHP and MySQL yourself, that
is fine. If you have configured these already, then you can simply run the python
script included called "Server.py", which is a self-contained web server specifically
for running the Impact.js game file as well as Weltmeister. "Server.py" is part of the 
package found at:  

    <https://github.com/amadeus/python-impact/>

After cloning the super-mario-world repository, simply:

    cd super-mario-world
    python server.py

This will create two localhost addresses where you can access the game as well as Weltmeister:

    Game:   http://localhost:8080
    Editor: http://localhost:8080/editor


###Power-ups
A staple of SMW: power-ups. The following power-ups are planned:

* **Fire Flower**   -> Shoots fire balls (2 MAX on screen). 
   

###Enemy AI
A huge part of this project will be to create enemies for the player to
encounter. A slew of planned enemies are as follows:

* **Goomba**        -> The standard SMW enemy. Moves from right to left.
* **Koopa**         -> Another classic enemy. Moves/jumpbs from right to left.

###Current Development
The following things contains a list of things in progress/todo:

* **Create basic testing level**                             -> Complete
* **Create Character and movement**                          -> Complete
* **Create basic enemy and movement**                        -> Complete
* **Enable damage/death capabilities**                       -> Complete
* **Create basic weapons for character**                     -> Complete
* **Replace test graphics with real Mario graphics**         -> TODO
* **Add Background music**                                   -> TODO
* **Add sound effects (jumping, hitting, etc)**              -> TODO
* **Create a basic HUD**                                     -> TODO
* **Create opening screen**                                  -> TODO
* **Transition between levels**                              -> TODO
* **Checkpoint entities**                                    -> TODO
* **Only Spawn enemies when in proximity to player**         -> TODO

###Useful Links

* **Spawn enemies when in proximity to player** : <http://impactjs.com/forums/help/spawn-entities-just-outside-of-players-view/>
* **Level Changing** : <http://impactjs.com/forums/help/moving-between-rooms-in-rpg/page/1/>

###Credits

Jesse Freeman: Introducing HTML5 Game Development
-------------------------------------------------
* Resouce pack (character sprites, enemy sprites, media)

Super Mario World Central <http://www.smwcentral.net/>
------------------------------------------------------
* Custom graphics, music compositions and sprite sheets

Contributors
------------
* Ian McBride : <https://bitbucket.org/ian_s_mcb>


###Future Development
Although this project's original plans are to re-create Super Mario 
World using Javascript, this is only the core design. The final goal
would be to create a side-scrolling action RPG, similar to Legend of
Zelda 2. Regarding storyline, that may be tacked on at the end, or 
possible proposed. As for now, the game will simply progress as a 
straightforward platformer. The proposed add-ons are as follows:

#####Level-up System
Incorporate a level-up system where stats such as health, strength,
defense, speed (something akin to Fire Emblem?) increase upon level
ups. Normally, score doesn't serve an actual purpose in a Mario game.
However, we'll use the score counter as a basis of level-up milestons,
just like Super Paper Mario did. Whether the player's stats will 
increase randomly (Fire Emblem) or selectively is to be determined.

#####Add Weapons
Naturally, an action RPG would require some sort of inventory of weapons.
Swinging a sword would be ideal (and really cool), but perhaps creating
a magical weapon which fires bolts would be simpler for a starting point.

#####Inventory
An inventory of stored items. Some items which would be ideal:

* **Mushroom**        -> Recovers health by X amount.



    
