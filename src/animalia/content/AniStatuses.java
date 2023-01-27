package animalia.content;

import arc.graphics.g2d.Draw;
import arc.math.Mathf;
import mindustry.gen.Unit;
import mindustry.graphics.Layer;
import mindustry.graphics.Pal;
import mindustry.type.StatusEffect;

public class AniStatuses {
    public static StatusEffect poisoned;

    public static void load(){
        poisoned = new StatusEffect("poisoned"){{
                damage = 1.25f;
                color = Pal.accent;
                speedMultiplier = 0.85f;
                damageMultiplier = 0.65f;
                healthMultiplier = 0.85f;
                buildSpeedMultiplier = 0.8f;
                dragMultiplier = 0.8f;
            }

            @Override
            public void draw(Unit unit){
                Draw.z(Layer.groundUnit + 1);
                Draw.mixcol(Pal.accent, Mathf.absin(2, 0.65f));

                Draw.rect(unit.type.fullIcon, unit.x, unit.y, unit.rotation - 90);

                Draw.reset();
            }
        };
    }
}
