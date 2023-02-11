package animalia.ui;

import animalia.ui.dialogs.ReportDialog;
import arc.Core;
import arc.struct.Seq;
import mindustry.Vars;
import animalia.ui.fragments.CataclysmFragment;
import animalia.ui.fragments.TemperatureFragment;
import mindustry.world.meta.Stat;
import mindustry.world.meta.StatValue;
import mindustry.world.meta.Stats;

public class AniUI {
    public static CataclysmFragment cataclysmFrag;
    public static TemperatureFragment tempFrag;

    public static ReportDialog reportDialog;

    public AniUI(){

    }

    public static void load(){
        cataclysmFrag = new CataclysmFragment();
        tempFrag = new TemperatureFragment();
        reportDialog = new ReportDialog();

        cataclysmFrag.build(Vars.ui.hudGroup);
        tempFrag.build(Vars.ui.hudGroup);

        reportDialog.load();

        AniLinks.load();

        if(!Core.settings.has("reportcrash")) Core.settings.put("reportcrash", true);
        if(!Core.settings.has("entryweathers")) Core.settings.put("entryweathers", true);

        Vars.ui.settings.game.checkPref(
            "reportcrash",
            Core.settings.getBool("reportcrash"),
            bool -> Core.settings.put("reportcrash", bool)
        );

        Vars.ui.settings.game.checkPref(
            "entryweathers",
            Core.settings.getBool("entryweathers"),
            bool -> Core.settings.put("entryweathers", bool)
        );
    }

    public static <T> void addStats(Stats stats, Stat main, boolean keepStat, String... values){
        stats.add(main, table -> {
            table.clear();
            table.left();

            table.table(t -> {
                for(String e : values) {
                    t.add(e).left();
                    t.row();
                }

                if (keepStat) {
                    t.row();
                    t.table(tt -> {
                        Seq<StatValue> stat = stats.toMap().get(main.category).get(main);

                        tt.add("[lightgray]" + main.localized() + (main.localized().endsWith(":") ? " " : ":[] "));

                        if (stat.size < 2) {
                            t.add(values[0]).left();
                        } else {
                            stat.get(0).display(tt);
                            tt.left();
                        }

                        tt.pack();
                    }).growX().left();
                }
            }).fillX();
        });
    }

    public static String statValue(String stat, String value){
        return "[lightgray]" + Core.bundle.get(stat) + (stat.endsWith(":") ? " " : ":[] ") + value;
    }

    public static String statValueBundle(String stat, String value){
        return statValue(stat, Core.bundle.get(value));
    }
}
