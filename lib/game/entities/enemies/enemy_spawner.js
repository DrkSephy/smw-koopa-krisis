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
    'game.entities.enemies.enemy_spawner'
)

.requires(
    'impact.entity',
    'game.entities.player',

    'game.entities.enemies.bird',
    'game.entities.enemies.blue_koopa',
    'game.entities.enemies.bobomb',
    'game.entities.enemies.bony_beetle',
    'game.entities.enemies.bony_beetle_new',
    'game.entities.enemies.boo',
    'game.entities.enemies.bowser_statue',
    'game.entities.enemies.bullet_shooter',
    'game.entities.enemies.buzzy_beetle',
    'game.entities.enemies.fire_bros',
    'game.entities.enemies.flying_blue_koopa',
    'game.entities.enemies.flying_green_koopa',
    'game.entities.enemies.flying_red_koopa',
    'game.entities.enemies.flying_yellow_koopa',
    'game.entities.enemies.goomba',
    'game.entities.enemies.green_koopa',
    'game.entities.enemies.hammer_bros',
    'game.entities.enemies.iggy_koopa',
    'game.entities.enemies.jumping_ninji',
    'game.entities.enemies.magical_koopa',
    'game.entities.enemies.muncher',
    'game.entities.enemies.paragoomba',
    'game.entities.enemies.pink_muncher',
    'game.entities.enemies.red_koopa',
    'game.entities.enemies.rex',
    'game.entities.enemies.spike',
    'game.entities.enemies.spike_top',
    'game.entities.enemies.spiny',
    'game.entities.enemies.skeleton',
    'game.entities.enemies.thwomp',
    'game.entities.enemies.yellow_koopa',
    'game.entities.enemies.boomer'    
)

.defines(function() {
    EntityEnemy_spawner = ig.Entity.extend({
        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(196, 255, 0, 0.7)',

        enemy: null,

        update: function() {
            // Check distance to player
            var xdist = Math.abs(ig.game.player.pos.x - this.pos.x);
            var ydist = Math.abs(ig.game.player.pos.y - this.pos.y);
            console.log(ig.system.width);

            if((xdist <= (ig.system.width - 25)) && (ydist <= (ig.system.height - 50))) {
                // Spawn the real entity
                console.log("Time to spawn enemy");
                console.log('Entity' + this.enemy);
                ig.game.spawnEntity('Entity' + this.enemy, this.pos.x, this.pos.y);

                // Kill static entity
                this.kill();
            }
        }
    });
});
