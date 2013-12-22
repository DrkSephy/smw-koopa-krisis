/*
Blue Koopa
----------
AI: Moves left and right, detects ledges.
*/

ig.module('game.entities.enemies.blue_koopa')
.requires('game.entities.ai.basic_ai')

.defines(function() {
    EntityBlue_koopa = EntityBasic_ai.extend({
        // Add animation
        animSheet: new ig.AnimationSheet('media/enemies/koopa_blue.png', 32, 32),
        size: {x: 18, y: 29},
        //flip: false,
        //health: 10,
        collide_damage: 2,
        stomp: new ig.Sound('media/sounds/sfx/smw_stomp.*'),


        // Set up animations
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('crawl', 0.20, [0,1]);
            this.offset.x = 6;
            this.offset.y = 2;
        },

       

        update: function() {
            var xdir = this.flip ? -1 : 1;
            this.vel.x = this.speed * xdir;
            this.parent();
        }
    }); // End EntityBlueKoopa
}); // End .defines
