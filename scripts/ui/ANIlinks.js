const ANItex = require("ui/ANItex");

module.exports = {
    animaliaLinks: null,

    createLinks(){
        this.animaliaLinks = [
            new Links.LinkEntry("animalia", "https://github.com/FlinTyX/Animalia/releases", ANItex.frog, Pal.heal)
        ];
    },

    addLink(link){
        this.animaliaLinks.push(link);

        this.setup();
    },

    setup(){
        if(!this.animaliaLinks){
            this.createLinks();
        }

        const all = this.animaliaLinks.concat(Links.links),
        array = Packages.java.lang.reflect.Array.newInstance(Packages.mindustry.ui.Links.LinkEntry, all.length);

        all.forEach((e, i) => array[i] = e);

        Reflect.set(Links, "links", array);
    }
}