/*
    levelexit.js
    ------------
    This file is used to create level exit 'sprites', used
    for transitioning between levels. Impact uses `triggers`,
    which executes an activity when the player interacts with
    the object. Triggers can be made without having graphics
    for the object.
*/
ig.module(
    'game.entities.miscellaneous.levelexit'
    )
.requires(
    'impact.entity'
)
.defines(function(){
    EntityLevelexit = ig.Entity.extend({
    /* Our level exit doesn't have graphics, so
    we will create a box that is displayed within
    Weltmeister to represent our level exit. */

    // The following properties tell Weltmeister how
    // to render the object inside the edit view.
    // The following draws a blue 8x8 box.
    animSheet: new ig.AnimationSheet('media/star.png', 16, 16),
    size: {x: 16, y:16},
    gravity: 0,
    gravityFactor: 0,

    // The following property is set during the entitiy's 
    // construction by the settings parameter which will 
    // be passed from the level data
    level: null,

    // Add collision properties 
    checkAgainst: ig.Entity.TYPE.A,

    init: function(x,y,settings){
        this.parent(x,y,settings);
        this.addAnim('idle', 0.2, [0,1,2]);
    },


    // Override `update()` and remove this.parent() so
    // we are not wasting render cycles to draw an entity
    // which has no graphics
    update: function(){ 
        this.currentAnim = this.anims.idle;
        this.parent();
    },

    // Override `check()` to handle collision:
    check: function(other) {
        /* Test the instance of `other`, which is passed into
           the method during a collision. Also, check if the
           collision is caused by a player, just in case there
           are other TYPE.A entities in the level */
            if (other instanceof EntityPlayer) {
                ig.game.toggleStats(this);
            }
        },

    //pre-director plugin level switching    
    /*nextLevel: function(){
            if (this.level) {

                // Use a regular expression to cleanup the exit's level property
                // As well as make sure the level name is capitalized properly.
                var levelName = this.level.replace(/^(Level)?(\w)(\w*)/, function(m, l, a, b) {
                    return a.toUpperCase() + b;
                });

                // This line waits until the main game's update loop is completed
                // before loading the level. This avoids redraw errors.
                ig.game.loadLevelDeferred(ig.global['Level' + levelName]);
            }
        }*/
    }); // Ends EntityLevelexit
}); // End .defines
   
