/*
Jumping Ninji
-------------
*/

ig.module('game.entities.enemies.jumping_ninji')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityJumping_ninji = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/ninji.png', 25, 26),
        size: {x: 19, y: 17},
        flip: false,
        speed: 8,
        //health: 10,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('stand', 0.10, [0] );
            this.addAnim('jump', 0.15, [1]);
            this.offset.x = 3;
            this.offset.y = 1;
            this.jumptimer = new ig.Timer(); // timer for 3 seconds
        },

        update: function() {
            var player = ig.game.getEntitiesByType(EntityPlayer)[0];
            var xdir = this.flip ? -1 : 1;
            var randNum = Math.random() < 0.5? 100 : 139.1;

            if(this.standing && this.jumptimer.delta()) {
                // Jump action
                if(this.pos.y = randNum) {
                    this.vel.y = -7000;
                    this.currentAnim = this.anims.jump;
                    this.jumptimer.set(0);
                }
            }
            this.parent();
        },

        handleMovementTrace: function(res) {
            this.parent(res);
            if(res.collision.x) {
                this.anims.stand.flip.x = this.flip;
                this.gravityFactor = 3;
            }
        }
    }); // End EntityJumping_ninji
}); // End .defines
