const {DynamicDrawBuilding} = require("libs/ANIdrawers"),
      {requestRegion} = require("libs/ANIdraw");

/**
 *  Weird rhino fuckery
 *  only uses frog types because they are the only animals in the public branch for now
*/

const reconstructor = module.exports = extend(GenericCrafter, "genetic-reconstructor", {
    configurable: true,
    allowConfigInventory: false,
    update: true,
    solid: true,
    saveConfig: true,

    drawer: new DynamicDrawBuilding(Color.valueOf("a387eaff"), build => !build.config() ? null : build.config().getEgg().fullIcon),

    unitValid(unit){
        return !!unit.animalType && !unit.isHidden() && !unit.isBanned();
    }
});

reconstructor.config(UnitType, (tile, unit) => {
    if(tile.block.unitValid(unit)){
        tile.setConfig(unit);
    }
});

reconstructor.configClear(tile => tile.setConfig(null));

reconstructor.buildType = () => extend(GenericCrafter.GenericCrafterBuild, reconstructor, {
    type: null,

    setConfig(unit){
        this.type = unit;
    },
    consValid(){
        return this.type && this.cons.valid() && !this.items.has(this.type.getEgg());
    },
    drawConfigure(){
        this.super$drawConfigure();

        if(this.type){
            requestRegion(this, 90, this.type);
        }
    },
    craft(){
        this.consume();

        if(this.type != null){
            this.offload(this.type.getEgg());
        }

        this.block.craftEffect.at(this);
        this.progress %= 1;
    },
    updateTile(){
        this.super$updateTile();
        this.dump();
    },
    canDump(other, item){
        return !this.block.consumes.consumesItem(item);
    },
    configured(builder, value){
        /**
         * WARNING: bad and unstable code 
         * i have made this because there is an issue in the current configs code that doesnt let modded units (specifically adapters) to be selected/configured
        */

        this.super$configured(builder, value);

        if(this.type != value && this.block.configurations.containsKey(value.class)){
            this.type = value;
        }
    },
    buildConfiguration(table){
        ItemSelection.buildTable(this.block, table, Vars.content.units().select(u => this.block.unitValid(u)), () => this.config(), item => {
            this.configure(item);
            this.progress = 0;
        }, false);
    },
    config(){
        return this.type;
    },
    write(write){
        this.super$write(write);
        write.s(!this.type ? -1 : this.type.id);
    },
    read(read, revision){
        this.super$read(read, revision);
        this.type = Vars.content.unit(read.s());
    }
});