/*
Magical Koopa
-------------
Has the following AI:
  1. Teleports a reasonable amount of pixels away from the
     player (in front of him). During this, play his
     animation frame [0] (idle). The teleportation will need
     some method of determining whether or not the magic koopa
     is landing on a valid tile. Not sure how to check that.
  2. Calculates an angle to the player, and fires a projectile
     at the player (the projectile can pass through all objects).
     (Use the flame.png for the projectile, it's 32x16 pixels.)
     Play frames [0,1,2] for shooting animation.
  3. Repeat this cycle.
*/

ig.module('game.entities.enemies.magical_koopa')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityMagical_koopa = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/magical_koopa.png', 32, 32),
        size: {x: 32, y: 32},
        flip: false,
        //health: 10,

        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('shoot', 0.20, [0,1,2,3] );
            this.offset.x = 0;
            this.offset.y = 0;
            this.anims.shoot.flip.x = false;
        },

        update: function() {
            var xdir = this.flip ? -1 : 1;
            this.vel.x = this.speed * xdir;
            this.parent();
        },

        handleMovementTrace: function(res) {
            this.parent(res);
            if(res.collision.x)
                this.anims.shoot.flip.x = this.flip;
        }
    }); // End EntityMagical_koopa
}); // End .defines
