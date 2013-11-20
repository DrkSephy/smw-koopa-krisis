/*
Flying Blue Koopa
-----------------
*/

ig.module('game.entities.enemies.flying_blue_koopa')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityFlying_blue_koopa = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/koopa_blue.png', 32, 32),
        size: {x: 19, y: 29},
        //flip: false,
        //health: 10,
        speed: 15,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('crawl', 0.30, [2,3]);
            this.offset.x = 4;
            this.jumpTimer = new ig.Timer();
            //this.offset.y = 1;
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
    }); // End EntityFlying_blue_koopa
}); // End .defines
