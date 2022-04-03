const scripts = [
    //items
    "items/items", "items/eggs",

    //blocks
    "blocks/blocks",
    
    //units
    "units/unitTypes",

    //gen idk
    "gen/weathers"
];

function replace(str){
    const i = str.lastIndexOf("/");
    return str.substring(0, i) + "/ANI" + str.substring(i + 1);
}

scripts.forEach(e => 
    require(replace(e))
);

print("Animalia mod is loaded!");