const {DrawConstruct} = require("libs/ANIdrawers");

const printer = module.exports = extend(GenericCrafter, "eggshell-printer", {
    drawer: new DrawConstruct(e => e.block.outputItem.item.upRegion())
});

printer.buildType = () => extend(GenericCrafter.GenericCrafterBuild, printer, {
    consValid(){
        return this.cons.valid() && !this.items.has(this.block.outputItem.item);
    }
});