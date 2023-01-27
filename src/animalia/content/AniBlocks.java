package animalia.content;

import animalia.world.environment.*;
import animalia.world.units.*;
import animalia.world.power.*;
import arc.Core;
import arc.graphics.Color;
import arc.graphics.g2d.TextureRegion;
import mindustry.content.Items;
import mindustry.type.Category;
import mindustry.world.*;
import mindustry.world.blocks.production.GenericCrafter;
import mindustry.world.draw.*;

import static mindustry.type.ItemStack.*;

public class AniBlocks {
    public static Block
    //environment
    tree,
    //crafing
    bioreactor,
    //units
    incubator,
    //power
    dischargeReceptor;

    public static void load(){
        //region environment

        tree = new SeasonalTree("tree"){{
            size = 2;
        }};

        //endregion environment
        //region crafting

        bioreactor = new GenericCrafter("bioreactor"){{
            updateEffect = AniFx.bioreactor;
            updateEffectChance = 1f;

            drawer = new DrawMulti(
                new DrawRegion("-bottom"),
                new DrawPlasma(){{
                        plasma1 = Color.valueOf("5d50a4");
                        plasma2 = Color.valueOf("5c5e9f");
                    }
                    @Override
                    public void load(Block block){
                        regions = new TextureRegion[plasmas];
                        for(int i = 0; i < regions.length; i++){
                            regions[i] = Core.atlas.find("impact-reactor" + suffix + i);
                        }
                    }
                },
                new DrawDefault()
            );
        }};

        //endregion crafting
        //region units

        incubator = new Incubator("incubator"){{
            size = 3;

        }};

        //endregion units
        //region power

        dischargeReceptor = new DischargeReceptor("discharge-receptor"){{
            size = 2;

            requirements(Category.power, with(Items.silicon, 60, Items.graphite, 60, Items.surgeAlloy, 60));
        }};

        //endregion power
    }
}
