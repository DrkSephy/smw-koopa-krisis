ig.module('game.entities.detect')

.defines(function(){
    EntityDetect = ig.Entity.extend({

  update: function() {

        // Check if enemy is near edge. If so, return
        // Check if enemy hits anything in the collision map
        // If true, toggle `this`
        if( !ig.game.collisionMap.getTile (
            this.pos.x + (this.flip ? + 4: this.size.x -4),
                this.pos.y + this.size.y+1)
        ){
            this.flip = !this.flip;
        }
        var xdir = this.flip ? -1 : 1;
        this.vel.x = this.speed * xdir;
        this.parent();
    },

  });

});
