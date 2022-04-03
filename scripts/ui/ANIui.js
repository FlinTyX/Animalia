const CataclysmFrag = require("ui/fragments/CataclysmFragment")

module.exports = {
    cataclysmFrag: CataclysmFrag,

    addStats(stats, main, keepStat, values){
        stats.add(main, extend(StatValue, {
            display(table){
                table.clear();
                table.left();
                
                table.table(null, t => {
                    values.forEach(e => {
                        t.add(e).left();
                        t.row();
                    });

                    if(keepStat){
                        t.row();
                        t.table(null, tt => {
                            let stat = stats.toMap().get(main.category).get(main);
                            tt.add("[lightgray]" + main.localized() + (main.localized().endsWith(":") ? " " : ":[] "));

                            if(stat.size < 2){
                                tt.add(values[0]).left();
                            } else {
                                stat.get(0).display(tt);
                                tt.left();
                            }

                            tt.pack();
                        }).growX().left();
                    }
                }).fillX();
            }
        }));
    },

    statValue(stat, value){
        return "[lightgray]" + Core.bundle.get(stat.toString()) + (stat.toString().endsWith(":") ? " " : ":[] ") + value.toString();
    },

    statValueBundle(stat, value){
        return this.statValue(stat, Core.bundle.get(value));
    },

    init(){
        this.cataclysmFrag.build(Vars.ui.hudGroup);
    }
};

Events.on(ClientLoadEvent, () => {
    if(!Vars.headless){
        module.exports.init();
    }
});