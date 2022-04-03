const {cataclysmFrag, addStats, statValue} = require("ui/ANIui");

module.exports = function(/**base, name, object */){
    this.name = arguments[1];

    this.cataclysm = extend(arguments[0], this.name, Object.assign({
        alwaysUnlocked: true,

        showWarning: true,
        warnDuration: 60 * 6,

        consequences: [],

        build(){
            return Core.bundle.format("weather.animalia-warning", this.localizedName);
        },
        reStats(){
            let conseqs = "";

            if(this.consequences.length > 0){
                this.consequences.forEach(e => {
                    conseqs += e.name + (this.consequences.indexOf(e) != this.consequences.length - 1 ? ", " : "");
                });
            } else conseqs += "[lightgray]" + Core.bundle.get("none");

            addStats(this.stats, Stat.health, false, [
                statValue("stat.consequence", conseqs)
            ]);
        },
        setStats(){
            this.super$setStats();
            this.reStats();
        },
        isHidden(){
            return false;
        },
        create(intensity, duration){
            this.initConsequences(this.super$create(intensity, duration));

            Groups.build.each(b => {
                if(b.setCataclysm){
                    b.setCataclysm(this.name);
                }
            });

            if(this.showWarning){
                cataclysmFrag.collapse(this.build(), this.warnDuration, this.consequences);
            }
        },
        remove(){
            this.super$remove();

            Groups.build.each(b => {
                if(b.setCataclysm){
                    b.setCataclysm(null);
                }
            });
        },
        initConsequences(state){
            if(this.consequences.length > 0){
                this.consequences.forEach(e => {
                    e.init(state);
                });
            }
        },
        updateConsequences(state){
            if(this.consequences.length > 0){
                this.consequences.forEach(e => {
                    e.update(state);
                });
            }
        },
        update(state){
            this.super$update(state);
            this.updateConsequences(state);
        }
    }, arguments[2]));

    return this.cataclysm;
}
