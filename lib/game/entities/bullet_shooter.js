/*
Bullet shooter
--------------
Has the following AI:

  1. Calculates the distance to the player.

  2. If the player is not very close to the shooter.
     then spawn a bullet (bullet_bill.png, it's 16x16 pixels).
     (You can spawn new entities by using:
        ig.spawnEntity(Entity_____, this.pos.x, this.pos.y)
        where ____ denotes the entity name to spawn.)
     The shooter should have a timer, where it shoots every X seconds.
     Use your own judgement for the timer (it would be kind
     of mean if it shot bullets every millisecond :) )

  3. Repeat. Note: The bullet shooter should not fire bullets when 
     the player is very close to it, we don't want to hit the player
     when they don't expect it.
  
Bullet bill
-----------
This entity is also a part of the Bullet Shooter, so a separate file
must be created for the bullet bill (bullet_bill.js). To set this 
projectile up, take a look at "fireball.js".

Behavior: Just moves in the proper direction of where the player is facing.
          Goes through all obstacles and enemies, only collides with the player.
Note: You need to pass in the direction of the bullet so it goes in the right
      direction. If the player is moving right, then this should be shot right, and
      vice verse. Take a look at the fireball.js to see how to pass in the right
      direction.

*/
