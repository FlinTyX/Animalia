const scripts = [
    //items
    "items/eggs",

    //blocks
    "blocks/crafting/carbonizer",
    
    "blocks/crafting/eggshell-printer", 

    "blocks/crafting/bioreactor",

    "blocks/crafting/genetic-reconstructor",

    "blocks/units/incubator",  

    "blocks/production/chlorophyll-synthesizer", "blocks/production/chlorophyll-panel",

    "blocks/power/converter",

    //turrets
    "blocks/turrets/egg-thrower",
    
    //units
    "units/frog"
];

function replace(str){
    function rev(){
        str = str.split("").reverse().join("");
    }

    rev();
    str = str.replace("/", "INA/");
    rev();

    return str; 
}

scripts.forEach(e => 
    require(replace(e))
);

print("Animalia mod is loaded!");