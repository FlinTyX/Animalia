const {DrawBuilding} = require("libs/ANIdrawers");

const synthesizer = extend(GenericCrafter, "chlorophyll-synthesizer", {
    drawer: DrawBuilding(Pal.heal)
});

synthesizer.buildType = () => extend(GenericCrafter.GenericCrafterBuild, synthesizer, {});