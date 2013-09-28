ig.module('game.entities.basic_movement')

.defines(function(){
    EntityBasic_movement = ig.Entity.extend({

   update: function() {
        var xdir = this.flip ? -1 : 1;
        this.vel.x = this.speed * xdir;
        this.parent();
     },
   });

});
