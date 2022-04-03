const GroupSpawner = require("types/spawners/GroupSpawner"),
      {randomElement, around} = require("libs/ANIfunctions");

module.exports = {
    FrogSpawner: new GroupSpawner({
        chance: 0.00002,
    
        add(){
            for(let e of arguments){
                this.types.push({type: e, map: []});
                this.refresh(this.types[this.types.length - 1]);
            }
    
            return this;
        },
        push(element){
            this.types.push({type: element, map: []});
            this.refresh(this.types[this.types.length - 1]);
    
            return element;
        },
        valid(sorted, team){
            return Units.canCreate(team, sorted.type) &&
                   (sorted.type.unlocked || !Vars.state.isCampaign()) && 
                   sorted.map.length > 0;
        },
        refresh(sorted){
            sorted.map.length = 0;
            Vars.world.tiles.eachTile(t => {
                if(!t.solid() && sorted.type.spawnFloors.indexOf(t.floor().localizedName) != -1){
                    let a = around(t.x, t.y, 1, e => sorted.type.validateSpawn(e));
        
                    if(a.length > 0){
                        sorted.map.push({
                            tile: t,
                            floors: a      
                        });
                    }
                }
            });
        },
        create(team, type, object){
            const {x, y} = object.tile;
            const floor = randomElement(object.floors);
            const angle = Angles.angle(x, y, floor.x, floor.y);
        
            const unit = type.spawn(team, x * 8, y * 8);
            unit.lookAt(angle);
            unit.jump(0);
        },
        spawn(sorted, team){
            const copy = [];
    
            sorted.map.forEach(e => {
                if(!e.tile.solid()){
                    e.floors.forEach(f => {
                        if(sorted.type.validateSpawn(f)) copy.push(e);
                    });
                }
            });
            
            if(copy.length > 0){
                this.create(team, sorted.type, randomElement(copy));
            }
        }
    })
}

Events.on(WorldLoadEvent, () => {
    module.exports.FrogSpawner.types.forEach(t => module.exports.FrogSpawner.refresh(t));
});