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
            other.receiveDamage(-10, this);
            this.kill();
        }
    })
});