ig.module(
    'game.main'
)
.requires(
    'impact.game',
    'impact.font',
    'impact.timer',
    //'impact.debug.debug',
    'game.levels.mainlevel1',
    'game.levels.maincastle',
    'game.levels.gauntlet',
    'game.levels.gauntlet2',
    'game.levels.boss1lair',
    'game.levels.snowy',
    'game.levels.best_overworld',
    'game.levels.forestRuins',
    'game.levels.mountain',
    'game.levels.worldmap',
    'game.levels.desert',
    'game.levels.tutorial',
    'game.levels.outdoorcastle',
    'game.levels.undergrounddesert',
    'game.levels.undergroundsnow',
    'game.levels.overworld',
    'game.levels.newoverworld',
    'game.levels.DeepForest',
    'game.levels.startscreen',
    'game.levels.credits',
    'game.entities.gameplayer',
    'game.entities.enemies.spike',
    'game.entities.miscellaneous.crate',
    'game.entities.miscellaneous.item_block',
    'game.entities.miscellaneous.respawn',
    'game.entities.miscellaneous.healthcrate',
    'game.entities.powerups.healthpotion',
    'game.entities.powerups.green_mushroom',
    'plugins.hud.hud',
    'plugins.camera.camera',
    'plugins.director.director'
)
//Everything in the ``.defines(function()`` block of code is
//the game logic.

.defines(function(){


// First game class
MyGame = ig.Game.extend({

    // Add HUD property for displaying lives
    lifeSprite: new ig.Image('media/mario.png'),
    coinSprite: new ig.Image('media/coin_sprite.png'),

    lastCheckpoint: null,
    playerSpawnPos: {x: 0, y: 0},

    // Properties for player stats screen
    statText: new ig.Font( 'media/04b03.font.png' ),
    showStats: false,
    statMatte : new ig.Image('media/stat-matte.png'),
    levelTimer : new ig.Timer(),
    levelExit: null,
    camera: null,
    stats: {time: 0, kills: 0, deaths: 0, score: 0},

    // Load a font
    font: new ig.Font( 'media/04b03.font.png' ),
    // Create a new hud instance from plugins(dot)hud(dot)hud.js
    hud: new ig.hud(),
    projectiles: 3,
    gravity: 300,
    lives: 3,
    coins: 0,
    maxStage: 0, // Highest stage beaten by player

    levelVariables: [ LevelGauntlet2, LevelBest_overworld, LevelSnowy, LevelUndergroundsnow, LevelUndergrounddesert, LevelMainlevel1, LevelOutdoorcastle, LevelForestRuins,
                      LevelDesert, LevelMountain, LevelMaincastle, LevelBoss1lair ],

    levelMusic: ['romancing_saga_last', 'map_theme', 'snowman', 'barrel_volcano', 'ryu', 'maze', 'snake_man', 'tarm_ruins',
                 'desert', 'dark_world', 'madness_fortress', 'epic_boss'],

    init: function() {

        // Initialize your game here; bind keys etc.
        this.camera = new Camera( ig.system.width/3, ig.system.height/3, 5 );
        this.camera.trap.size.x = ig.system.width/10;
        this.camera.trap.size.y = ig.system.height/3;
        this.camera.lookAhead.x = ig.ua.mobile ? ig.system.width/6 : 0;

        //Create key bindings
        ig.input.bind( ig.KEY.LEFT_ARROW, 'left');
        ig.input.bind( ig.KEY.RIGHT_ARROW, 'right');
        ig.input.bind( ig.KEY.UP_ARROW, 'up');
        ig.input.bind( ig.KEY.DOWN_ARROW, 'down');
        //ig.input.bind( ig.KEY.TAB, 'switch');
        ig.input.bind( ig.KEY.Z, 'select');
        ig.input.bind( ig.KEY.X, 'jump');
        ig.input.bind( ig.KEY.C, 'shoot');
        ig.input.bind( ig.KEY.SPACE, 'continue');

        this.myDirector = new ig.Director(this, this.levelVariables, this.levelMusic, 'media/sounds/' );
        this.myDirector.firstLevel();

        var player = ig.game.getEntitiesByType('EntityPlayer')[0];
        this.hud.setMaxHealth(player.health);

        //applies audio settings
        ig.music.volume = 0.8
    },

    update: function() {
        /* This code allows the camera to follow the player
           by overriding the update function using the method
           of the game class called `getEntitiesByType()`.
           This API allows us to find instances of entities in
           our game. */

        var player = this.getEntitiesByType( EntityPlayer )[0];
        if( player ) {
            this.camera.follow(this.player);
            //this.screen.x = player.pos.x - ig.system.width/2;
            //this.screen.y = player.pos.y - ig.system.height/2;
            // If the player moves, erase the instructions
            if(player.accel.x > 0 && this.font)
                this.font = null;
        }
        // Update all entities and backgroundMaps
        /* We need to change this code to pull up the stat screen.
           We test if it is time to show the stats screen. If it
           is not being displayed, we call "this.parent()" and the
           game continues normally. Otherwise, we listen for an input
           state 'continue' */
        if(!this.showStats){
            this.parent();
        }
        else{
            if(ig.input.pressed('continue')){
                this.parent();
                this.showStats = false;
                this.maxStage = this.myDirector.currentLevel;
                this.myDirector.loadLevel(1);
                ig.music.play(1);
            }
        }
        // Add your own, additional update code here
    },

    addCoin: function(){
        this.coins += 1;
        if(this.coins == 100){
            this.lives += 1;
            this.coins = 0
        }
    },

    decreaseProjectile: function(){
        this.projectiles -= 1;
    },

    incrementProjectile: function(){
        this.projectiles += 3;
    },

    increaseScore: function(points){
        //increase score by certain number of points
        this.stats.score += points;
    },


    //pre-director plugin level switching

    // Override loadLevel to start a timer to track the player
    loadLevel: function(data) {


        // Load animation sheets
        //Overworld
        var world_water = new ig.AnimationSheet('media/overworld/world_map.png', 16, 16);
        var flowers = new ig.AnimationSheet('media/overworld/flowers.png', 16, 16);
        var dugtrio = new ig.AnimationSheet('media/overworld/dugtrio.png', 16, 16);
        var cute_dugtrio = new ig.AnimationSheet('media/overworld/cute_dugtrio.png', 16, 16);
        var cute_hill = new ig.AnimationSheet('media/overworld/cute_hill.png', 16, 16);
        var cute_lightgreen_trees = new ig.AnimationSheet('media/overworld/cute_lightgreen_trees.png', 16, 16);
        var cute_trees = new ig.AnimationSheet('media/overworld/cute_trees.png', 16, 16);
        var canoe = new ig.AnimationSheet('media/new_overworld/canoe.png', 16, 16);
        var desert_tree = new ig.AnimationSheet('media/new_overworld/desert_tree.png', 16, 16);
        var fire = new ig.AnimationSheet('media/new_overworld/fire.png', 16, 16);
        var ice = new ig.AnimationSheet('media/new_overworld/ice.png', 16, 16);
        var overworld_lava = new ig.AnimationSheet('media/new_overworld/overworld_lava.png', 16, 16);
        var sand_tile = new ig.AnimationSheet('media/new_overworld/sand_tile.png', 16, 16);
        var skull = new ig.AnimationSheet('media/new_overworld/skull.png', 16, 16);
        var dark_world = new ig.AnimationSheet('media/new_overworld/dark_world_tile.png', 16, 16);
        //other
        var water = new ig.AnimationSheet('media/fg/animatedwater.png', 16, 16);
        var waterfall = new ig.AnimationSheet('media/fg/animated_waterfall.png', 16, 16);
        var lava = new ig.AnimationSheet('media/fg/lava.png', 16, 16);

        this.backgroundAnims = {
        'media/overworld/world_map.png':{
        12: new ig.Animation(world_water, 0.40, [12, 13, 14, 15])
        },
        'media/new_overworld/desert_tree.png':{
        0: new ig.Animation(desert_tree, 0.40, [0,1,2,3])
        },
        'media/new_overworld/skull.png':{
        0: new ig.Animation(skull, 0.40, [0,1,2,3])
        },
        'media/new_overworld/dark_world_tile.png':{
        0: new ig.Animation(dark_world, 0.40, [0,1,2,3])
        },
        'media/new_overworld/sand_tile.png':{
        0: new ig.Animation(sand_tile, 0.40, [0,1,2,3])
        },
        'media/new_overworld/overworld_lava.png':{
        0: new ig.Animation(overworld_lava, 0.40, [0,1,2,3])
        },
        'media/new_overworld/ice.png': {
        0: new ig.Animation(ice, 0.40, [0,1,2,3])
        },
        'media/new_overworld/fire.png': {
        0: new ig.Animation(fire, 0.40, [0,1,2,3])
        },
        'media/new_overworld/canoe.png':{
        0: new ig.Animation(canoe, 0.40, [0,1])
        },
        'media/overworld/flowers.png':{
        0: new ig.Animation(flowers, 0.40, [0,1,2,3])
        },
        'media/overworld/cute_dugtrio.png':{
        0: new ig.Animation(cute_dugtrio, 0.40, [0,1,2,3])
        },
        'media/overworld/cute_hill.png':{
        0: new ig.Animation(cute_hill, 0.40, [0,1,2,3])
        },
        'media/overworld/cute_lightgreen_trees.png':{
        0: new ig.Animation(cute_lightgreen_trees, 0.40, [0,1,2,3])
        },
        'media/overworld/cute_trees.png':{
        0: new ig.Animation(cute_trees, 0.40, [0,1,2,3])
        },
        'media/overworld/dugtrio.png':{
        0: new ig.Animation(dugtrio, 0.40, [0,1,2,3])
        },
        'media/fg/animatedwater.png': {
            0: new ig.Animation(water, 0.3, [0,1,2,3])
        },
            'media/fg/animated_waterfall.png': {
            0: new ig.Animation(waterfall, 0.2, [0,1,2,3])
        },
            'media/fg/lava.png': {
            0: new ig.Animation(lava, 0.2, [0,1,2,3])
       }};
     

        this.stats = {time: 0, kills: 0, deaths: 0, score: 0};

        this.parent(data);

        // Set up checkpoint data for respawning of player
        this.player = this.getEntitiesByType( EntityPlayer )[0];
        this.lastCheckpoint = null;
        this.playerSpawnPos = {
            x: this.player.pos.x,
            y: this.player.pos.y
        };
        this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
        this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;
        this.camera.set( this.player );
        this.levelTimer.reset();

    }, // End loadLevel

    toggleStats: function(levelExit){
        this.showStats = true;
        this.stats.time = Math.round(this.levelTimer.delta());
        this.levelExit = levelExit;
    }, // End toggleStats

    respawnPlayerAtLastCheckpoint: function(x,y){
    var pos = this.playerSpawnPos;
    if(this.lastCheckpoint){
        pos = this.lastCheckpoint.getSpawnPos()
        }
    this.player = this.spawnEntity(EntityGameplayer, pos.x, pos.y);
    },

    gameOver: function(){
        ig.finalStats = ig.game.stats;
        ig.system.setGame(GameOverScreen);
    },

    draw: function() {

        // Draw all entities and backgroundMaps
        this.parent();

        // Draw life counter (HUD)
        this.lifeSprite.draw(((this.lifeSprite.width)) + 240, 10);
        this.statText.draw("X: " + this.lives, 275, 15 );

        // Draw coin counter (HUD)
        this.coinSprite.draw(((this.coinSprite.width)) + 185, 10);
        this.statText.draw("X: " + this.coins, 220, 15 );

        // Add controls to bottom of game
        // **This will be replaced with a <div></div>
        // in the final product. **
        if(this.font){
            var x = ig.system.width/2;
            var y = ig.system.height - 10;
            this.font.draw('Left/Right: Move, X: Jump, C: Attack',
            x, y, ig.Font.ALIGN.CENTER)
        } // End if(this.font);

        // This is where we add our Stat Screen when the level is complete
        if(this.showStats){
            this.statMatte.draw(0,0);
            var x = ig.system.width/2;
            var y = ig.system.height/2 - 20;
            var score = (this.stats.score) - (this.stats.deaths * 50);
            this.statText.draw('Level Complete', x, y, ig.Font.ALIGN.CENTER);
            this.statText.draw('Time: ' + this.stats.time, x, y+30, ig.Font.ALIGN.CENTER);
            this.statText.draw('Kills: ' + this.stats.kills, x, y+40, ig.Font.ALIGN.CENTER);
            this.statText.draw('Score: ' +score, x, y+60, ig.Font.ALIGN.CENTER);
            this.statText.draw('Deaths: ' + this.stats.deaths, x, y+50, ig.Font.ALIGN.CENTER);
            this.statText.draw('Press Spacebar to continue.', x, ig.system.height - 10, ig.Font.ALIGN.CENTER);
        }
    } // End draw
});

// Game screens are added here.
// To add a game screen, we override the `ig.Game` class.
// The ig.Game class represents the active view of the game.
// To change to a new screen, we call ig.system.setGame and
// pass the reference of the game class we want to display.

StartScreen = ig.Game.extend({
        font: new ig.Font( 'media/04b03.font.png' ),
        background: new ig.Image('media/splash.png'),

        init: function(){
            //ig.music.add('media/sounds/MarbleHillZone.*');
            //ig.music.volume = 0.7;
            //ig.music.play();
            ig.input.bind(ig.KEY.SPACE, 'start');
            this.loadLevel(LevelStartscreen);
        },

        update: function(){
            if(ig.input.pressed('start')){
                ig.system.setGame(ContributorsScreen)
            }
            this.parent();
        }, // End update

        draw: function(){
            this.parent();
            //this.background.draw(0,0);
            var x = ig.system.width/2,
            y = ig.system.height/2;
            this.font.draw('Press the Spacebar to Continue', x + 5, y + 25, ig.Font.ALIGN.CENTER);
        } // End draw


    }); // End StartScreen

ContributorsScreen = ig.Game.extend({
        font: new ig.Font( 'media/04b03.font.png' ),
        init: function(){
            //ig.music.add('media/sounds/MarbleHillZone.*');
            //ig.music.volume = 0.7;
            //ig.music.play();
            ig.input.bind(ig.KEY.SPACE, 'start');
            this.loadLevel(LevelCredits);
        },

        update: function(){
            if(ig.input.pressed('start')){
                ig.system.setGame(CreditsScreen)
            }
            this.parent();
        }, // End update

        draw: function(){
            this.parent();
            //this.background.draw(0,0);
            var x = ig.system.width/2,
            y = ig.system.height/2;
            this.font.draw('Press the Spacebar Continue', x, y + 110, ig.Font.ALIGN.CENTER);
        } // End draw


    }); // End StartScreen

CreditsScreen = ig.Game.extend({

    font: new ig.Font( 'media/04b03.font.png' ),
        init: function(){
            //ig.music.add('media/sounds/MarbleHillZone.*');
            //ig.music.volume = 0.7;
            //ig.music.play();
            ig.input.bind(ig.KEY.SPACE, 'start');
        },

        update: function(){
            if(ig.input.pressed('start')){
                ig.system.setGame(MyGame)
            }
            this.parent();
        }, // End update

        draw: function(){
            this.parent();
            //this.background.draw(0,0);
            var x = ig.system.width/2,
            y = ig.system.height/2;
            this.font.draw('CREDITS', x, y - 100, ig.Font.ALIGN.CENTER);
            this.font.draw('Super Mario Central', x, y - 80, ig.Font.ALIGN.CENTER);
            this.font.draw('----------------------', x, y - 75, ig.Font.ALIGN.CENTER);
            this.font.draw('All custom backgrounds and foregrounds', x, y - 65, ig.Font.ALIGN.CENTER);
            this.font.draw('Nintendo', x, y - 45, ig.Font.ALIGN.CENTER);
            this.font.draw('----------', x, y - 40, ig.Font.ALIGN.CENTER);
            this.font.draw('Mario and all related sprites and gameplay mechanics', x, y - 30, ig.Font.ALIGN.CENTER);
            this.font.draw('And for making fan games like this possible', x, y - 20, ig.Font.ALIGN.CENTER);
            this.font.draw('Press the Spacebar to Start Playing!', x, y + 70, ig.Font.ALIGN.CENTER);
        } // End draw


})
// Start Game Over Screen
// Game over screen will show the player several stats as well

GameOverScreen = ig.Game.extend({

    instructText: new ig.Font( 'media/04b03.font.png' ),
    background: new ig.Image('media/stat-matte.png'),
    gameOver: new ig.Image('media/gameover.png'),
    stats: {},

    init: function() {
        ig.input.bind( ig.KEY.SPACE, 'start');
        this.stats = ig.finalStats;
    },

    update: function() {
        if(ig.input.pressed('start')){
            ig.system.setGame(StartScreen)
        }
        this.parent();
    },

    // Draw the stats on Game Over Screen
    draw: function() {
        this.parent();
        this.background.draw(0,0);
        var x = ig.system.width/2;
        var y = ig.system.height/2 - 20;
        this.gameOver.draw(x - (this.gameOver.width * .5), y - 30);
        var score = (this.stats.kills * 100) - (this.stats.deaths * 50);
        this.instructText.draw('Total Kills: ' +this.stats.kills, x, y+30, ig.Font.ALIGN.CENTER);
        this.instructText.draw('Total Deaths: ' +this.stats.deaths, x, y+40, ig.Font.ALIGN.CENTER);
        this.instructText.draw('Score: ' +score, x, y+50, ig.Font.ALIGN.CENTER);
        this.instructText.draw('Press Spacebar To Continue.', x, ig.system.height - 10, ig.Font.ALIGN.CENTER);
    }
});


/* The following code passes a reference to the Canvas, which is
a name for our game instance, and passes the frame rate and size
into the ig.main constructor. */

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
// Change "MyGame" to "StartScreen"
ig.main( '#canvas', StartScreen, 60, 320, 240, 2 );

});
