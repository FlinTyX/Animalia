const {DrawConstruct} = require("libs/ANIdrawers");

const printer = extend(GenericCrafter, "eggshell-printer", {
    drawer: DrawConstruct(i => i.block.outputItem.item.upRegion())
});

printer.buildType = () => extend(GenericCrafter.GenericCrafterBuild, printer, {
    consValid(){
        return this.cons.valid() && !this.items.has(this.block.outputItem.item);
    }
});