ig.module(
    'game.entities.overworldplayer'
)

.requires(
    'impact.entity'
)

.defines(function(){

    EntityOverworldplayer = ig.Entity.extend({
    // Set up animation sheet
    animSheet: new ig.AnimationSheet('media/overworld_mario.png', 16, 16),
    size: {x: 16, y: 16},
    flip: false,
    maxVel: {x: 400, y: 4000},
    friction: {x: 0, y: 0},
    gravityFactor: 0,
    

    init: function(x,y,settings){
        
        this.parent(x,y, settings);
        this.addAnim('idle', 0.10, [0,1]);
        this.addAnim('down', 0.10, [0,1]);
        this.addAnim('left', 0.10, [0,1]);
        this.addAnim('right', 0.10, [0,1]);
        this.addAnim('up', 0.10, [0,1]);


    }, // End init function

    update: function(){

        this.parent();
        if(ig.input.state('up')){
            this.vel.y = -100;
            this.currentAnim = this.anims.up;
        }
        else if(ig.input.pressed('down')){
            this.vel.y = 4000;
            this.currentAnim = this.anims.down;
        }
        else if(ig.input.state('left')){
            this.vel.x = -100;
            this.currentAnim = this.anims.left;
        }
        else if(ig.input.state('right')){
            this.vel.x = 100;
            this.currentAnim = this.anims.right;
        }
        else{
            this.vel.y = 0;
            this.vel.x = 0;
            this.currentAnim = this.anims.idle;
        }

    }, // End update function


    }); // End EntityPlayer
}); // End .defines