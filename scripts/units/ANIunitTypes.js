const ANIstatuses = require("libs/ANIstatuses"),
      {FrogType} = require("types/animals/FrogType"),
      {addStats, statValueBundle} = require("ui/ANIui");
      
module.exports = {
    frog: new FrogType("frog", {
        range: 60
    }),

    assaultFrog: new FrogType("assault-frog", {
        range: 90,
        jumpLen: 8,
        jumpChance: 0.015,
        swimSpeed: 1,
        usesTongue: false,

        spawnFloors: [
            Blocks.water.localizedName,
            Blocks.darksandWater.localizedName
        ],

        init(){
            this.super$init();
            this.register();

            this.weapons.addAll(extend(Weapon, "animalia-assault-cannon", {
                x: 0,
                y: -0.2,

                recoil: 0.5,
                recoilTime: 5,
                shootY: 3.3,
                reload: 5,
                mirror: false,
                rotate: true,
                ignoreRotation: true
            }));
        }
    }),

    //should i make a class function for poisonous frogs?
    exoticFrog: new FrogType("exotic-frog", {
        range: 16,
        usesTongue: false,
        status: ANIstatuses.poisoned,

        spawnFloors: [
            Blocks.taintedWater.localizedName,
            Blocks.darksandTaintedWater.localizedName,
            Blocks.darksandWater.localizedName
        ],

        setStats(){
            this.super$setStats();
            this.reStats();

            addStats(this.stats, Stat.size, true, [
                statValueBundle("stat.poisonous", "yes")
            ]);
        },
        update(unit){
            this.super$update(unit);

            Units.nearby(unit.x - unit.type.range, unit.y - unit.type.range, unit.type.range * 2, unit.type.range * 2, e => {
                if(!e.type.flying && e.type != unit.type && e.within(unit.x, unit.y, unit.type.range + e.hitSize/2)){
                    e.apply(this.status, 60 * 4.5);
                }
            });
        }
    })
}