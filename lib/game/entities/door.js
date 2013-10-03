/*
door.js
-------
Used to move between levels
*/

/*******************
 * Global Counters *
 *******************/

ig.module(
    'game.entities.door'
)
.requires(
    'impact.entity',
    'game.entities.player'
)
.defines(function(){

EntityDoor = ig.Entity.extend({

    // Set up collision
    // TYPE.B
    type: ig.Entity.TYPE.NONE,

    // If group B touches group A, check
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.NONE,

    //Make door as small as possible, so it can be resized easily
    //Door entity will be invisible
    size: {x: 8, y: 8},
    _wmScalable: true,
    _wmDrawBox:  true,
    _wmBoxColor: '#d2691e',

    //Set level to null, should be set in weltmeister
    level: null,

    // Initialize Entity
    init: function(x, y, settings) {
        this.parent(x, y, settings);

        // Load player object if not in weltmeister
        if (!ig.global.wm)
            my_player = ig.game.getEntitiesByType('EntityPlayer')[0];
    },

    update: function() {

    },

    check: function( other ) {
      //When Player is on top of door, he must press a button to go to the level
      //assigned to the door in weltmeister
      if(ig.input.state('continue')){
        if(other instanceof EntityPlayer){
          ig.game.loadLevel( ig.global['Level' + this.level]);
        }
      }
    }

    }); // End EntityDoor

}); // End .defines

