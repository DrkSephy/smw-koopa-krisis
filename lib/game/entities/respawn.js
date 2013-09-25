ig.module('game.entities.respawn')
.requires('impact.entity')

.defines(function () {
  EntityRespawn = ig.Entity.extend({
    size: {x: 18, y:18},
    zIndex: -1,
    type: ig.Entity.TYPE.NONE,
    checkAgainst: ig.Entity.TYPE.A,
    collides: ig.Entity.COLLIDES.NEVER,
    animSheet: new ig.AnimationSheet('media/midpoint.png', 18, 18),

    init: function(x,y,settings){
      this.parent(x,y,settings);
      this.addAnim('idle', 0.5, [0]);
    },

    update: function() {
      this.currentAnim.update();
    },

    getSpawnPos: function() {
      return {
        x: (this.pos.x + 11),
        y: this.pos.y
      };
    },

    activate: function(){
      this.active = true;
      ig.game.lastCheckpoint = this;

    },

    check: function (other) {
      if(!this.active){
        this.activate();
      }
    }
  });
});
