const {uc} = require("libs/ANIfunctions");

const eggshell = extend(Item, "eggshell", {
    load(){
        this.super$load();
        this.up = Core.atlas.find(this.name + "-up");
    },
    upRegion(){
        return this.up;
    }
});

const frogEgg = extend(Item, "frog-egg", {
    load(){
        this.super$load();
        this.up = Core.atlas.find(this.name + "-up");
    },
    init(){
        this.super$init();
        this.entity = uc("frog");
    },
    hatchTime(){
        return 60 * 10;
    },
    upRegion(){
        return this.up;
    },
    unit(){
        return this.entity;
    }
});