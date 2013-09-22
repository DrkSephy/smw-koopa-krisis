// Static entity to spawn real entity

ig.module(
  'game.entities.static_bony_beetle'
)

.requires(
  'impact.entity',
  'game.entities.player',
  'game.entities.bony_beetle'
)

.defines(function(){
  EntityStatic_bony_beetle = ig.Entity.extend({

    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(196, 255, 0, 0.7)',
    
    update: function(){
        //Check distance to player
        var xdist = Math.abs(ig.game.player.pos.x - this.pos.x);
        var ydist = Math.abs(ig.game.player.pos.y - this.pos.y);
        console.log(ig.system.width)
        if((xdist <= (ig.system.width - 50)) && (ydist <= 50)){
          //Spawn the real entity
          console.log("Time to spawn enemy");
          ig.game.spawnEntity(EntityBony_beetle, this.pos.x, this.pos.y);

        //Kill static entity
        this.kill();
      
      }
    }

  });
});