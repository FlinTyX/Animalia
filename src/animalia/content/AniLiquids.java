package animalia.content;

import arc.graphics.Color;
import mindustry.type.Liquid;

public class AniLiquids {
    public static Liquid nutritiveSolution;

    public static void load(){
        nutritiveSolution = new Liquid("nutritive-solution", Color.valueOf("8a73c6")){{
            lightColor = Color.valueOf("a387ea");
            heatCapacity = -1;
        }};
    }
}
