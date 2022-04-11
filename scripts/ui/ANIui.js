const crashes = {length: 0, latest: null},
      ANIlinks = require("ui/ANIlinks"),
      RedirectURLDialog = require("ui/dialogs/RedirectURLDialog");
      
module.exports = {
    reportDialog: new RedirectURLDialog("report", () => {
        return "https://github.com/FlinTyX/Animalia/issues/new?assignees=&labels=bug&body=" + Strings.encode(Strings.format(
            "# Crash Report:" + "\n" +
            "**Describe Your Issue**: ..." + "\n\n" +
            "**Platform**: `@`" + "\n" +
            "**Version**: `@`" + ", `Animalia @`" + "\n" +
            "**Latest Crash**: `@`" + "\n\n" +
            "Thanks for reporting your issue! It will be fixed as soon as possible.",

            OS.isAndroid ? "Android " + Core.app.getVersion() : (OS.osName + " x" + OS.osArchBits),
            Version.combined(), 
            Vars.mods.getMod("animalia").meta.version,
            crashes.latest, //how can i read whats inside it?
        ));
            
    }),

    cataclysmFrag: require("ui/fragments/CataclysmFragment"),

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
        return module.exports.statValue(stat, Core.bundle.get(value));
    },

    init(){
        module.exports.setupRules();
        module.exports.cataclysmFrag.build(Vars.ui.hudGroup);

        ANIlinks.setup();

        Vars.ui.settings.graphics.checkPref(
            "crashreport", 
            Core.settings.getBool("crashreport"),
            bool => Core.settings.put("crashreport", bool)
        );
    },

    setupRules(){
        crashes.length = Core.settings.getDataDirectory().child("crashes").file().listFiles().length;
        crashes.latest = Core.settings.getDataDirectory().child("crashes").file().listFiles()[0];

        if(!Core.settings.has("crashcounter")){
            Core.settings.put("crashcounter", new Packages.java.lang.Integer(crashes.length));
        }

        if(!Core.settings.has("crashreport")){
            Core.settings.put("crashreport", true);
        }

        if(Core.settings.getInt("crashcounter") > 0 && Core.settings.getInt("crashcounter") < crashes.length && Core.settings.getBool("crashreport")){
            module.exports.reportDialog.build();

            Core.settings.put("crashcounter", new Packages.java.lang.Integer(crashes.length));
        }
    }
};

Events.on(ClientLoadEvent, () => {
    module.exports.init();
});