/*

Player.js
---------
This file contains the code for our player entity. An
entity is any object which exists in the level but are
not a part of the map. The player class extends the 
main entity.js class. 

*/

// Create basic structure of an entity
ig.module(
    'game.entities.player'
)

.requires(
    'impact.entity'
)

.defines(function() {

EntityPlayer = ig.Entity.extend({

});
});