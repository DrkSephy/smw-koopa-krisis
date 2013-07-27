/*

Spike.js
--------
This is the entity file for our first monster.

*/

ig.module(
    'game.entities.spike'
)
.requires(
    'impact.entity'
)
.defines(function(){

EntitySpike = ig.Entity.extend({
    // Add animation
    animSheet: new ig.AnimationSheet( 'media/spike.png', 16, 9),
    size: {x: 16, y: 9},
    maxVel: {x: 100, y: 100},
    flip: false,

    


    });// End EntitySpike
});// End .defines