const {addStats, statValue} = require("ui/ANIui"),
      {uc} = require("libs/ANIfunctions");

function EggType(name){
    this.name = name;

    return extend(Item, this.name, {
        load(){
            this.super$load();
            this.up = Core.atlas.find(this.name + "-up");
        },  
        upRegion(){
            return this.up;
        }
    });
}

function EntityEggType(name, entity, time){
    this.name = name;
    this.entity = entity;
    this.time = !time ? 60 * 13 : time;

    return extend(Item, this.name, {
        entity: this.entity,
        time: this.time,

        load(){
            this.super$load();
            this.up = Core.atlas.find(this.name + "-up");
        },
        init(){
            this.super$init();
            this.entity = uc(this.entity);
        },
        setStats(){
            this.super$setStats();

            addStats(this.stats, Stat.explosiveness, true, [
                statValue("stat.hatch", (this.hatchTime() / 60).toString() + " " + Core.bundle.get("unit.seconds"))
            ]);
        },
        upRegion(){
            return this.up;
        },
        hatchTime(){
            return this.time;
        },
        unit(){
            return this.entity;
        }
    });
}

module.exports = {
    EggType : EggType,
    EntityEggType : EntityEggType
}