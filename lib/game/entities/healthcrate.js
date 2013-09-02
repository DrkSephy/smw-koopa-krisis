ig.module(
    'game.entities.healthcrate'
)
.requires(
    'game.entities.crate'
)

.defines(function() {

    EntityHealthcrate = EntityCrate.extend({
        animSheet: new ig.AnimationSheet('media/healthcrate.png', 8, 8),

        check: function(other) {
            if(other.name == 'player') {
                other.health = other.health + 100;
                this.kill();
            }
        }
    })
});