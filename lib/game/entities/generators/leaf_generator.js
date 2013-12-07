ig.module(
    'game.entities.generators.leaf_generator'
).requires(
    'impact.entity'
).defines(function(){

    EntityLeaf_generator = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(255, 170, 66, 0.7)',
        duration: 1,
        count: 10,
        nextEmit: null,
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.size.x = ig.system.width;
            this.nextEmit = new ig.Timer();
            // start right away
            this.nextEmit.set( 0 );
        },
        update: function(){
            if(  this.nextEmit.delta() >= 0.5 && this.count > 0 ) {
                this.count--;
                this.nextEmit.set( this.duration / this.count );
                var x = this.randomRange(ig.game.screen.x, ig.game.screen.x + ig.system.width);
                var y = ig.game.screen.y;
                ig.game.spawnEntity( EntityParticle, x, y );
            }
        },
        randomRange: function(min, max){
            return Math.random() * (max - min) + min;
        }
    });
    EntityParticle = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/leaves.png', 16, 16 ),
        size: {x: 16, y: 16},
        offset: {x: 0, y: 0},
        vel: {x: 80, y: 23},
        maxVel: {x: 60, y: 40},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.NEVER,
        bounciness: 0,
        friction: {x:0, y: 0},
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.addAnim( 'sway', 0.10, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18] );
            this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
        },
        update: function() {
            if( this.pos.y > ig.game.screen.y  + ig.system.height ) {
                // move it to the top screen
               this.pos.y = ig.game.screen.y;
            }
            // out of right bound
            if(this.pos.x > ig.game.screen.x + ig.system.width){
                this.pos.x = ig.game.screen.x;
            }
            // out of left bound
            if(this.pos.x < ig.game.screen.x){
                this.pos.x = ig.game.screen.x + ig.system.width;
            }
            this.parent();
        },
        handleMovementTrace: function(res){
            this.pos.x += this.vel.x * ig.system.tick;
            this.pos.y += this.vel.y * ig.system.tick;
        }
    });
});
