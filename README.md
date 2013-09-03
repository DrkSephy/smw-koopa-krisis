_Super Mario World - Koopa Krisis_ aims to recreate the original Super
Mario World (SMW) platformer from the Super Nintendo (SNES) using
JavaScript, HTML5 and CSS. Impact.js is a game engine which is ideal
for games involving 2D graphics, side-scrolling, collisions and it 
comes with its own level editor, Weltmeister. 

This project also aims to be a foundation for a potential project 
for the CCNY Association of Computing Machinery (ACM) Game Development
Special Interest Group(SIG). 

###Installation
----
NOTE-1: This game requires the use of a proprietary game engine, which
can be [purchased here](http://impactjs.com/buy-impact/).

NOTE-2: Portions of the game engine require PHP to be installed.
Installing PHP is discussed [here](https://bitbucket.org/DrkSephy/smw-koopa-krisis/wiki/PHP%20Installation).

    :::bash
    # make the directory that will contain the repo
    mkdir -p /path/to/repo/container/dir
    cd /path/to/repo/container/dir
    hg clone https://bitbucket.org/DrkSephy/smw-koopa-krisis
    # download the zip file for ImpactJS sdk 
    unzip /path/to/sdk/zip/file
    cp impact/weltmeister.html smw-koopa-krisis/
    cp -R impact/lib/ impact smw-koopa-krisis/lib
    cp -R impact/lib/weltmeister smw-koopa-krisis/lib
    cp -R impact/tools smw-koopa-krisis
    rm -R impact LICENSE.txt
	cd smw-koopa-krisis
	# serve up the game
	python server.py

###Power-ups
------------
A staple of SMW: power-ups. The following power-ups are planned:

* **Fire Flower**   -> Shoots fire balls (2 MAX on screen). 
   

###Enemy AI
-----------
A huge part of this project will be to create enemies for the player to
encounter. A slew of planned enemies are as follows:

* **Goomba**        -> The standard SMW enemy. Moves from right to left.
* **Koopa**         -> Another classic enemy. Moves/jumpbs from right to left.

###Current Development

Create basic testing level                           

    Status: 
        [X] Two levels have been completed using test graphics.
        [ ] Graphics must be swapped out for more appealing ones.

Create Character and movement                        

    Status: 
        [X] Test character has been inserted and movement/jump is enabled.
        [ ] New character sprite needs to be inserted/drawn. 

Create basic enemy and movement                      

    Status: 
        [X] One enemy has been completed. Enemy behavior can be used 
            to create new enemies, only a sprite sheet is needed.

Enable damage/death capabilities                    

    Status: Complete.
        [X] Character can inflict/recieve damage.

Create basic weapons for character                   

    Status: 
        [X] Character can shoot bullets/fire grenades, as well as
           switch between the two. 
        [X] Weapon switching system has been implemented
        [ ] Need more weapons, and graphics.

Add Background music                                 

    Status: 
        [X] Level theme has been added from resource pack.
        [X] Shooting, Jumping and Death Sound Effects added.

Create a basic HUD                                    
    
    Status: 
        [ ] Add HUD for life/score counters, as well as a timer.

Create screens                               

    Status: 
        [ ] Add a basic "title" screen. Will be replaced later.
        [ ] Add a "pause" screen.
        [ ] Add transitional screens.

Transition between levels                              

    Status: Complete.
        [X] Create an entity for switching between levels.

Checkpoint entities                                 

    Status:
        [ ] Create method/entity for saving midway through levels.

Only Spawn enemies when in proximity to player         

    Status:
        [ ] Create method for enemies not to spawn at the same time.


###Useful Links

* **Spawn enemies when in proximity to player** : <http://impactjs.com/forums/help/spawn-entities-just-outside-of-players-view/>
* **Level Changing** : <http://impactjs.com/forums/help/moving-between-rooms-in-rpg/page/1/>


###Credits
----------

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
---------------------
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



    
