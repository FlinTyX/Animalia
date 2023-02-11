package animalia.ui.dialogs;

import arc.Core;
import arc.files.Fi;
import arc.scene.ui.Dialog;
import arc.struct.Seq;
import arc.util.Align;
import arc.util.Strings;
import arc.util.Structs;
import mindustry.gen.Icon;
import mindustry.gen.Tex;
import mindustry.graphics.Pal;
import mindustry.ui.Styles;

public class ReportDialog extends Dialog {
    private static String latest = "";

    public ReportDialog(){
        super("");

        cont.add("@dialog.animalia-report.name", Styles.defaultLabel, 1).padLeft(4).center();
        cont.row();
        cont.image(Tex.whiteui, Pal.heal).growX().height(5).pad(5).padTop(8).width(500).align(Align.center);
        cont.row();
        cont.add("@dialog.animalia-report.description").width(500).wrap().pad(10).get().setAlignment(Align.center, Align.center);
        cont.row();

        cont.table(t -> {
            t.button("@back", Icon.left, this::hide).size(200, 54).pad(8).padTop(6).align(Align.center);

            t.button("@report", Icon.link, () -> {

                Core.app.openURI(URL());

            }).size(200, 54).pad(8).padTop(6).align(Align.center);
        });
    }

    public void load(){
        int length = 0;

        try {
            length = Core.settings.getDataDirectory().child("crashes").file().listFiles().length;
        } catch(Throwable ignore) {}

        if(!Core.settings.has("crashcounter")){
            Core.settings.put("crashcounter", length);
        }

        if(
            Core.settings.getInt("crashcounter") < length &&
            Core.settings.getBool("reportcrash") &&
            (latest = latestCrash()).contains("animalia.")
        ){
            show();
            Core.settings.put("crashcounter", length);
        };
    }

    public static String URL(){
        return "https://github.com/FlinTyX/Animalia/issues/new?assignees=&labels=bug&body=" +
            Strings.encode(Strings.format(
                """
                ###### @FlinTyX , the guy that will try to fix your issue

                ---
                
                **Issue**: *Explain your issue in detail.*
                            
                **Steps to reproduce**: *How you happened across the issue, and what exactly you did to make the bug happen.*

                ---
                            
                *Place an X (no spaces) between the brackets to confirm that you have read the line below.*
                - [ ] **I have updated to the latest release (https://github.com/FlinTyX/Animalia/releases) to make sure my issue has not been fixed.**
                - [ ] **I have searched the closed and open issues to make sure that this problem has not already been reported.**
                
                ###### Latest crash found:
                ```
                @
                ```
                """, "@", latest
            )
        );
    }

    public long parseDate(Fi fi){
        return Strings.parseLong(fi.name().replaceAll("[^0-9]", ""), 0);
    }

    public String latestCrash(){
        try {
            Seq<Fi> files = Core.settings.getDataDirectory().child("crashes").seq();

            Fi first = files.max(Structs.comparingLong(e -> parseDate(e)));

            return "Crash: " + first.toString().substring(62) + "\n\n".concat(first.readString());
        } catch(Exception e){
            return "Failed Loading Crashes: " + e.toString();
        }
    }
}