/*
Flying Green Koopa
------------------
1. Enemy skips around (jumps up and down while moving left/right).
*/

ig.module('game.entities.enemies.flying_green_koopa')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityFlying_green_koopa = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/koopa_green.png', 32, 32),
        size: {x: 19, y: 29},
        //flip: false,
        speed: 20,
        //health: 10,
        collide_damage: 3,
        stomp: new ig.Sound('media/sounds/sfx/smw_stomp.*'),

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('crawl', 0.25, [2,3]);
            this.offset.x = 4;
            //this.offset.y = 1;
            this.jumpTimer = new ig.Timer();
        },

        

        update: function() {
            var player = ig.game.getEntitiesByType(EntityPlayer)[0];
            var xdir = this.flip ? -1 : 1;
            this.vel.x = this.speed * xdir;
            this.parent();

            if(this.standing && this.jumpTimer.delta() > 0) {
                this.vel.y = -100;
                this.jumpTimer.set(0);
            }
        }
    }); // End EntityFlying_green_koopa
}); // End .defines
