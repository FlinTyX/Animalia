package animalia.ui.fragments;

import arc.Core;
import arc.scene.Element;
import arc.scene.Group;
import mindustry.Vars;
import mindustry.ui.Styles;

// TODO h.
public class TemperatureFragment {
    private final int width = 80, height = 150;
    private static Element ele;

    public void build(Group parent){
        parent.fill(t -> {
            t.top();
            t.right();
            t.visible = Vars.ui.hudfrag.shown;

            t.table(Styles.black3, tt -> {
                tt.collapser(v -> v.add().width(150), true, () -> Core.settings.getBool("minimap")).right().row();
            }).right().fillX().fillY();

            /*
            t.table(tt -> {
                ele = tt.fill((x, y, w, h) -> {
                    TextureRegion
                            reg = Core.atlas.find("weather-lord-thermometer"),
                            bottom = Core.atlas.find("weather-lord-thermometer-bottom");

                    Draw.color(Pal.lancerLaser, Pal.bulletYellow, Pal.remove, get() / 100f);
                    Draw.rect(bottom, x, y, reg.width, reg.height);

                    Draw.reset();
                    Draw.rect(reg, x, y, reg.width, reg.height);
                });

                ele.visible = Vars.ui.hudfrag.shown;
                ele.touchable = Touchable.enabled;

                ele.update(() -> {
                    ele.setFillParent(true);
                    ele.setBounds(0, 0, Core.camera.width, Core.camera.height);
                });

                ele.clicked(() -> {
                    Log.info("seggs");
                });
            }).fillX().padRight(5);
            */
        });
    }
}
