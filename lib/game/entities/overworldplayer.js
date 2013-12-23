ig.module(
    'game.entities.overworldplayer'
)

.requires(
    'impact.entity',
    'game.entities.player'
)

.defines(function(){

    EntityOverworldplayer = EntityPlayer.extend({
    // Set up animation sheet
    animSheet: new ig.AnimationSheet('media/overworld/overworld_mario.png', 16, 16),
    size: {x: 16, y: 16},
    flip: false,
    speed: 50,
    maxVel: {x: 400, y: 4000},
    friction: {x: 0, y: 0},
    gravityFactor: 0,
    initial: true,

    init: function(x,y,settings){
        this.parent(x,y, settings);
        this.addAnim('idle', 0.10, [0,1]);
        this.addAnim('down', 0.10, [0,1]);
        this.addAnim('left', 0.10, [0,1]);
        this.addAnim('right', 0.10, [0,1]);
        this.addAnim('up', 0.10, [0,1]);
    }, // End init function

    update: function(){
        if(this.initial) {
            var lastStage = ig.game.getEntitiesByType(EntityOwdoor).filter(
                function(entity) {return entity.level === ig.game.maxStage}
            )[0];
            this.pos.x = lastStage.pos.x;
            this.pos.y = lastStage.pos.y;
            this.initial = false;
        }
        if(this.vel.x === this.vel.y) {
            if(ig.input.state('up')){
                this.vel.y = -this.speed;
                this.currentAnim = this.anims.up;
            }
            else if(ig.input.state('down')){
                this.vel.y = this.speed;
                this.currentAnim = this.anims.down;
            }
            else if(ig.input.state('left')){
                this.vel.x = -this.speed;
                this.currentAnim = this.anims.left;
            }
            else if(ig.input.state('right')){
                this.vel.x = this.speed;
                this.currentAnim = this.anims.right;
            }
        }
        this.parent();
    }, // End update function
    }); // End EntityPlayer
}); // End .defines