const {randomElement} = require("libs/ANIfunctions");

module.exports = function(object){
    this.spawner = Object.assign({
        types: [],

        chance: 0,
        randomTeam: true,
        
        sort(){
            return randomElement(this.types);
        },
        add(){
            for(let e of arguments){
                this.types.push(e);
            }

            return this;
        },
        push(element){
            this.types.push(element);

            return element;
        },
        shouldSpawn(){
            return Mathf.chance(this.chance);
        },
        valid(sorted, team){
            return true;
        },
        spawn(sorted, team){

        }
    }, object);

    Events.on(Trigger.update.class, () => {
        if(this.spawner.types.length < 1) return;

        const sorted = this.spawner.sort();

        if(Vars.state.isPlaying() && !Vars.net.server() && this.spawner.shouldSpawn()){
            if(this.spawner.randomTeam){
                const valids = Vars.state.teams.active.select(e => this.spawner.valid(sorted, e.team));

                if(valids.size > 0){
                    this.spawner.spawn(sorted, valids.random().team);
                }

                return;
            }

            if(this.spawner.valid(sorted, Vars.state.rules.defaultTeam)){
                this.spawner.spawn(sorted, Vars.state.rules.defaultTeam);
            }
        }
    });

    return this.spawner;
}
