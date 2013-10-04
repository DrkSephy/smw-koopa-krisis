/*
    killblock.js
    ------------
    This file is used to create a kill block that will be used to
    place over bottomless pit/lava. When any entity makes contact 
    with it  will be killed.
*/
ig.module(
    'game.entities.killblock'
    )
.requires(
    'impact.entity',
    'game.entities.player'
)
.defines(function(){
    EntityKillblock = ig.Entity.extend({

    // The following properties tell Weltmeister how
    // to render the object inside the edit view.
    // The following draws a blue 15x15 box.
    _wmDrawBox: true,
    _wmBoxColor: 'rgba(0,0,255,0.7)',
    size: {x: 15, y: 15},


    // Set up collision
    type: ig.Entity.TYPE.B,

    // If group B touches group A, group A is hurt
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.PASSIVE,


	update: function(){ },
	
    collideWith: function(other) {
    	var player = ig.game.getEntitiesByType(EntityPlayer)[0];
    
    // Anything collides with the kill block method this.kill() is called.
    if( other instanceof EntityPlayer ) {
    
    	this.kill();

        }
    },


    /*
    Simply setting up collisions isn't enough, we must create a method
    which will check if a collision occurs. This method overrides the 
    .check() function, which gets called when a collision is detected, 
    and applies damage to the entity it collides with.
    */
    check: function( other ) { 
        other.receiveDamage( 1, this );
      

    },

    kill: function(){
        ig.game.stats.kills ++;
        ig.game.increaseScore(100);
        this.parent();
        ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, {colorOffset: 1});
        

    }, // End Kill method

    receiveDamage: function(value){
        this.parent(value);
        if(this.health > 0)
            ig.game.spawnEntity(EntityDeathExplosionParticle, this.pos.x, this.pos.y, {particles:2, colorOffset: 1});
    }, // End receiveDamage

    
    }); // End Flying Yellow Koopa
}); // End .defines









