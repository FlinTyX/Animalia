const GroupSpawner = require("types/spawners/GroupSpawner"),
      {randomElement, around} = require("libs/ANIfunctions");

module.exports = {
    FrogSpawner: new GroupSpawner({
        chance: 0.02,
    
        add(){
            for(let e of arguments){
                this.types.push({type: e, map: []});
            }
    
            if(Vars.state.isPlaying()){
                this.refresh();
            }

            return this;
        },
        push(element){
            this.add(element);
    
            return element;
        },
        valid(sorted, team){
            return Units.canCreate(team, sorted.type) &&
                   (sorted.type.unlocked || !Vars.state.isCampaign()) && 
                   sorted.map.length > 0;
        },
        refresh(){
            this.types.forEach(e => e.map.length = 0);

            Vars.world.tiles.eachTile(t => {
                this.types.forEach(element => {
                    if(!t.solid() && element.type.spawnFloors.indexOf(t.floor().localizedName) != -1){
                        let a = around(t.x, t.y, 1, e => element.type.validateSpawn(e));
            
                        if(a.length > 0){
                            element.map.push({
                                tile: t,
                                floors: a      
                            });
                        }
                    }
                });
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
    module.exports.FrogSpawner.refresh();
});