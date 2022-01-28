//base function, adds anything to the table. clears the table if keepStat is false
function addStats(stats, main, keepStat, values){
    stats.add(main, extend(StatValue, {
        display(table){
            table.clear();
            table.left();
            
            table.table(null, t => {
                if(keepStat){
                    const cont = new Table();
                    cont.add("[lightgray]" + main.localized() + ":[] ");
                    stats.toMap().get(main.category).get(main).get(0).display(cont);

                    t.row();
                    t.add(cont).left(); //why is it painful
                    t.row();
                }

                values.forEach(e => {
                    t.row();
                    t.add(e).left();
                });
            }).fillX();
        }
    }));
}

function statValue(stat, value){
    return new Label("[lightgray]" + 
        Core.bundle.get(stat.toString()) + ":[] " + Core.bundle.get(value.toString())
    );
}


module.exports = {
    addStats : addStats,
    statValue : statValue
};