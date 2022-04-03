const {randomElement} = require("libs/ANIfunctions"),
      {thunder1} = require("libs/ANIfx"),
      {thunderBoom} = require("libs/ANIsounds");

function Consequence(name, object){
    return Object.assign({
        name: Core.bundle.get("consequence.animalia-" + name + ".name"),

        init(state){

        },
        update(state){
            
        }
    }, object);
}

module.exports = {
    Thunder: function(object){
        return new Consequence("thunder", Object.assign({
            damage: 500,
            damageRadius: 200,

            thunders: 1,
            thunderShake: 10,
            thunderEffect: thunder1,
            thunderSound: thunderBoom,

            effects(x, y){
                Effect.shake(this.thunderShake, this.thunderShake, x, y);
                Fx.massiveExplosion.at(x, y);
                this.thunderEffect.at(x, y);
                this.thunderSound.at(x, y);
            },
            update(state){
                const builds = [];
                Groups.build.each(e => {
                    if(!(e.block instanceof CoreBlock)) builds.push(e);
                });

                for(let i = 0; i < Math.max(1, Math.round(Math.random() * this.thunders)); i++){
                    let build = randomElement(builds.filter(e => e.isValid()));

                    if(!build) return;

                    let closestReceptor = Geometry.findClosest(build.x, build.y, builds.filter(e => e.isValid() && e.block.lightingReceptor));

                    if(closestReceptor != null && closestReceptor.enabled && build.within(closestReceptor, closestReceptor.block.activeRange())){
                        closestReceptor.charge(this.damage);
                        this.effects(closestReceptor.x, closestReceptor.y + closestReceptor.offsetY() * 2.2);

                        return;
                    }

                    this.effects(build.x, build.y);
                    Damage.damage(build.x, build.y, this.damageRadius, this.damage);

                    for(let e = 0; e < Math.random() * 20; e++){
                        Lightning.create(Team.derelict, Pal.lancerLaser, this.damage / 20, build.x, build.y, 360 * Math.random(), 35);
                    }
                }
            } 
        }, object));
    },

    Fire: function(object){
        return new Consequence("fire", Object.assign({
            fireChance: 0.5,
            
            update(state){
                if(Mathf.chance(this.fireChance * state.intensity * state.opacity)){
                    const tile = Vars.world.tile(Vars.world.width() * Math.random(), Vars.world.height() * Math.random());

                    Fires.create(tile);
                }
            }
        }, object));
    }
}