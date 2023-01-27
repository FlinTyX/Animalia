package animalia.ui.fragments;

import arc.Core;
import arc.graphics.Color;
import arc.math.Mathf;
import arc.scene.Group;
import arc.scene.event.Touchable;
import arc.util.Time;
import mindustry.Vars;
import mindustry.ui.Styles;
import animalia.type.Consequence;

public class CataclysmFragment {
    public Consequence[] consequences = {};
    public String title = "", text = "";
    float duration = 0f;

    public void build(Group parent){
        parent.fill(t -> {
            t.top();
            t.visible = Vars.ui.hudfrag.shown;

            t.collapser(v -> v.add().height(38), () -> Vars.state.isPaused() || Core.settings.getBool("displayCoreItems")).row();

            t.table(b -> {
                b.collapser(top -> top.table(m -> {
                    m.table(tt -> {
                        tt.background(Styles.black6).add("").pad(8).update(label -> {
                            label.color.set(Color.orange).lerp(Color.scarlet, Mathf.absin(Time.time, 2, 1));
                            label.setText(title);
                        });
                    });
                m.row();

                m.table(tt -> {
                    tt.add("").pad(1).update(label -> {
                        label.setText(text);
                        label.setFontScale(0.83f);
                    });
                });

                }), true, () -> {
                    if(!Vars.ui.hudfrag.shown || Vars.state.isPaused()) return false;
                    if(Vars.state.isMenu()){
                        duration = 0;
                        return false;
                    }
                    return (duration -= Time.delta) > 0;
                })
                .touchable(Touchable.disabled)
                .fillX().row();
            });
        });
    }

    public void build(){
        text = Core.bundle.get("stat.consequence") + ": ";

        if(consequences.length > 0){
            for(Consequence c : consequences) text += c.name + ", ";
            text = text.substring(0, text.length() - 2);
        } else text += "[lightgray]" + Core.bundle.get("none");
    }
    public void collapse(String title, float duration, Consequence[] consequences){
        this.title = title;
        this.duration = duration;
        this.consequences = consequences;

        build();
    }
}
