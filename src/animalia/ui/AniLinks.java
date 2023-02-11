package animalia.ui;

import arc.struct.Seq;
import arc.util.Reflect;
import mindustry.gen.Icon;
import mindustry.graphics.Pal;
import mindustry.ui.Links;

public class AniLinks {
    public static Seq<Links.LinkEntry> links = Seq.with(
        new Links.LinkEntry("animalia", "https://github.com/FlinTyX/Animalia/releases", AniTex.frog, Pal.heal),
        new Links.LinkEntry("report", AniUI.reportDialog.URL(), Icon.warning, Pal.remove)
    );

    public static void load(){
        links.add(Links.getLinks());

        Reflect.set(Links.class, "links", links.toArray(Links.LinkEntry.class));
    }
}
