ig.module(
  'game.entities.crate'
)
.requires(
  'impact.entity'
)
.defines(function(){

  EntityCrate = ig.Entity.extend({
    size: {x: 8, y: 8},
    health: 20,
    type: ig.Entity.TYPE.B,
    checkAgainst: ig.Entity.TYPE.A,
    animSheet: new ig.AnimationSheet( 'media/crate.png', 8, 8 ),

    init: function( x, y, settings ) {
      
      this.parent( x, y, settings );
      this.addAnim( 'idle', 1, [0] );
    }
  })
});

