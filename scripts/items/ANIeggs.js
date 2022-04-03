const {EntityEggType, EggType} = require("types/EggTypes");

function entities(){
    const copy = [],
          filtered = Object.keys(module.exports).filter(e => e != "eggshell");
    
    filtered.forEach(e => copy.push(module.exports[e]));

    return copy;
}

module.exports = {
    eggshell: new EggType("eggshell"),
    frogEgg: new EntityEggType("frog-egg", "frog"),
    assaultFrogEgg: new EntityEggType("assault-frog-egg", "assault-frog", 60 * 25),
    exoticFrogEgg: new EntityEggType("exotic-frog-egg", "exotic-frog", 60 * 18)
}

module.exports.entityEggs = entities();