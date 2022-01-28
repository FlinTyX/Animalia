const {DrawBuilding} = require("libs/ANIdrawers");

const reconstructor = extend(GenericCrafter, "genetic-reconstructor", {
    drawer: DrawBuilding(Color.valueOf("a387eaff"))
});

reconstructor.buildType = () => extend(GenericCrafter.GenericCrafterBuild, reconstructor, {
    consValid(){
        return this.cons.valid() && !this.items.has(this.block.outputItem.item);
    }
});