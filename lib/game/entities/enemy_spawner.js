// Static entity to spawn real entity

/************************/
/***** HOW TO USE *******/
/************************/

/*
  1. Place this entity in weltmeister, wherever you want to spawn 
     an enemy.
  2. Give the entity a key value like this: enemy: enemy_name,
     where you replace "enemy_name" with the name of the enemy 
     you wish to spawn from the .requires list.
  3. That's all there is to it.


*/

ig.module(
  'game.entities.enemy_spawner'
)

.requires(
  'impact.entity',
  'game.entities.player',
  'game.entities.rex',
  'game.entities.muncher',
  'game.entities.bird',
  'game.entities.blue_koopa',
  'game.entities.bobomb',
  'game.entities.bony_beetle',
  'game.entities.buzzy_beetle',
  'game.entities.flying_blue_koopa',
  'game.entities.flying_green_koopa',
  'game.entities.flying_red_koopa',
  'game.entities.flying_yellow_koopa',
  'game.entities.goomba',
  'game.entities.green_koopa',
  'game.entities.paragoomba',
  'game.entities.red_koopa',
  'game.entities.spike',
  'game.entities.spike_top',
  'game.entities.spiny',
  'game.entities.yellow_koopa',
  'game.entities.bullet_shooter',
  'game.entities.jumping_ninji',
  'game.entities.hammer_bros',
  'game.entities.bony_beetle_new'
)

.defines(function(){
  EntityEnemy_spawner = ig.Entity.extend({

    _wmScalable: true,
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(196, 255, 0, 0.7)',
    
    enemy: null,
    
    update: function(){
        //Check distance to player
        var xdist = Math.abs(ig.game.player.pos.x - this.pos.x);
        var ydist = Math.abs(ig.game.player.pos.y - this.pos.y);
        console.log(ig.system.width)
        if((xdist <= (ig.system.width - 50)) && (ydist <= 50)){
          //Spawn the real entity
          console.log("Time to spawn enemy");
          console.log('Entity' + this.enemy);
          ig.game.spawnEntity('Entity' + this.enemy, this.pos.x, this.pos.y);

        //Kill static entity
        this.kill();
      
      }
    }

  });
});
