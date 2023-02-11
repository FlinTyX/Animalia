package animalia.content;

import animalia.type.EggType;
import arc.graphics.Color;
import mindustry.type.Item;

import static animalia.content.AniUnitTypes.*;

public class AniItems {
    public static EggType eggshell, frogEgg, assaultFrogEgg, exoticFrogEgg, leopardFrogEgg;
    public static Item carbonFiber, chlorophyll;

    public static void load(){
        carbonFiber = new Item("carbon-fiber", Color.valueOf("404040")){{
            cost = 1.2f;
        }};

        chlorophyll = new Item("chlorophyll", Color.valueOf("4a4b53")){{
            cost = 1.1f;
        }};

        eggshell = new EggType("eggshell", Color.white);
        frogEgg = new EggType("frog-egg", frog, Color.valueOf("92dd7e"), 25);
        assaultFrogEgg = new EggType("assault-frog-egg", assaultFrog, Color.valueOf("deffdd"), 40);
        exoticFrogEgg = new EggType("exotic-frog-egg", exoticFrog, Color.valueOf("f3e979"), 30);
        leopardFrogEgg = new EggType("leopard-frog-egg", leopardFrog, Color.valueOf("edf3a9"), 30);
    }
}
