/*
owdoor.js
-----
Used to go to levels from OverWorld
*/
ig.module(
    'game.entities.miscellaneous.owdoor'
)
.requires(
    'game.entities.miscellaneous.door',
    'game.entities.overworldplayer'
)
.defines(function(){

EntityOwdoor = EntityDoor.extend({
    _wmBoxColor: 'rgba(252, 134, 134, 0.5)',
    collides: ig.Entity.COLLIDES.NEVER,
    player: 'EntityOverworldplayer',
    stick: true,

    init: function(x, y, settings) {this.parent(x, y, settings);},

    towards: function(other) {
        // Determines if a player is moving towards or away from a level block
        if (other instanceof eval(this.player)) {
            var pos = other.pos.x - this.pos.x + other.pos.y - this.pos.y;
            var vel = other.vel.x + other.vel.y;
            var bool = (vel^pos < 0) & (pos !== 0)
            return bool
        }
    },

    check: function(other) {
        var toward = this.towards(other);

        // See if distance between character and level portal is close to 0
        var dist  = Math.abs(other.pos.x - this.pos.x) < 0.7 && Math.abs(other.pos.y - this.pos.y) < 0.7;

        if ( (other.vel.x !== 0 || other.vel.y !== 0) &&
            dist && toward
            ) 
        {
            other.vel.x = 0;
            other.vel.y = 0;
            other.pos.x = this.pos.x;
            other.pos.y = this.pos.y;
            this.stick = false;
        }

        this.stick = !toward && dist;

        if (other instanceof eval(this.player) && this.level) {
            this.parent(other);        
        }
    }
});
});