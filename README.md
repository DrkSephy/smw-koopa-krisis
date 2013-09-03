***Super Mario World - Koopa Krisis*** aims to recreate the original Super
Mario World (SMW) platformer from the Super Nintendo (SNES) using
JavaScript, HTML5 and CSS. Impact.js is a game engine which is ideal
for games involving 2D graphics, side-scrolling, collisions and it 
comes with its own level editor, Weltmeister. 

This project also aims to be a foundation for a potential project 
for the CCNY Association of Computing Machinery (ACM) Game Development
Special Interest Group(SIG). 

##Installation
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

##Contributors
----
* David Leonard <https://bitbucket.org/DrkSephy>
* Ian McBride: <https://bitbucket.org/ian_s_mcb>

##Special Thanks To
----
* Jesse Freeman (the author of helpful book on ImpactJS)
