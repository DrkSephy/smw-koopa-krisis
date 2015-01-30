Super Mario World - Koopa Krisis aims to recreate the original Super Mario World (SMW) platformer from the Super Nintendo (SNES) using JavaScript, HTML5 and CSS. This game uses the ImpactJS game engine, which is ideal for games involving 2D graphics, side-scrolling, collisions and comes with its own level editor (named Weltmeister).

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
	# clone repo
    hg clone https://bitbucket.org/DrkSephy/smw-koopa-krisis
    # NOTE: use your browser to download the zip file for the ImpactJS sdk
	# unzip the sdk files into current directory
    unzip /path/to/sdk/zip/file
	# copy ImpactJS sdk into local repo
    cp impact/weltmeister.html smw-koopa-krisis/
    cp -R impact/lib/ impact smw-koopa-krisis/lib
    cp -R impact/lib/weltmeister smw-koopa-krisis/lib
    cp -R impact/tools smw-koopa-krisis
    rm -R impact LICENSE.txt
	cd smw-koopa-krisis
	# download large game audio
	wget https://bitbucket.org/DrkSephy/smw-koopa-krisis/downloads/Final.ogg
	mv Final.ogg media/sounds
	# serve up the game
	python server.py

##Contributors
----
* David Leonard <https://github.com/DrkSephy>
* Ian McBride: <https://bitbucket.org/ian_s_mcb>
* Wan Kim Mok: <https://bitbucket.org/mk200789>
* Kevin Chan: <https://github.com/chessmasterhong>
* Jorge Yau:  <https://bitbucket.org/accountname>
* Jonathan Reyes: <https://bitbucket.org/JARey>

##Special Thanks To
----
* Jesse Freeman (the author of helpful book on ImpactJS)
