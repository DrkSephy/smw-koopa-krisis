ig.module(
    'game.entities.miscellaneous.item_block'
)

.requires(
    'impact.entity',
    'game.entities.player',
    'game.entities.powerups.hammer_suit',
    'game.entities.powerups.fireflower',
    'game.entities.powerups.mushroom',
    'game.entities.powerups.green_mushroom',
    'game.entities.coin'
)

.defines(function(){
    EntityItem_block = ig.Entity.extend({
        size: {x: 16, y: 16},
        gravity: 0,
        gravityFactor: 0,
        powerup: null,
        collides: ig.Entity.COLLIDES.PASSIVE,
        type: ig.Entity.TYPE.B, 
        checkAgainst: ig.Entity.TYPE.A,
        speed: 0,
        maxVel: {x: 0, y:0},
        numPowers: 0,
        spawnPower: new ig.Sound('media/sounds/sfx/item_appear.*'),
        animSheet: new ig.AnimationSheet('media/questionmark_block.png', 16, 16),

        init: function(x, y, settings){
            this.parent(x, y, settings);
            this.addAnim('rotate', 0.20, [0,1,2,3]);
            this.addAnim('hit', 1, [4]);
        }, // End init

        collideWith: function(other, axis ) {
            var player = ig.game.getEntitiesByType(EntityPlayer)[0];
    
            // Only do something if colliding with the Player
            if( other instanceof EntityPlayer ) {
                if( axis == 'y' ) {
                    if(this.pos.y <= player.pos.y) {
                        if(this.numPowers == 0) {
                            this.currentAnim = this.anims.hit;
                            this.spawnPower.volume = 0.5;
                            this.spawnPower.play();
                            // To spawn any item you like, use the following key-value pair: powerup: NAME
                            // Example: power: Mushroom, power: Hammer_suit
                            ig.game.spawnEntity('Entity' + this.powerup, this.pos.x, (this.pos.y - 3));
                            this.numPowers += 1;
                        }
                    } else {
                        // Fix for player sliding on top of item block
                        if(other.vel.x == 0)
                            other.currentAnim = other.anims.idle;
                        else
                            other.currentAnim = other.anims.run;
                    }
                }
            }
        }, // End collideWith

        // Fix for killable item blocks
        receiveDamage: function(value, other) {} // End receiveDamage
    })
}) // End .defines