const {DrawBuilding} = require("libs/ANIdrawers");

const synthesizer = module.exports = extend(GenericCrafter, "chlorophyll-synthesizer", {
    drawer: new DrawBuilding(Pal.heal)
});

synthesizer.buildType = () => extend(GenericCrafter.GenericCrafterBuild, synthesizer, {});