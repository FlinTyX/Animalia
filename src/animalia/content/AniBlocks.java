package animalia.content;

import animalia.type.unit.AnimalType;
import animalia.world.crafting.GeneticReconstructor;
import animalia.world.draw.DrawBuild;
import animalia.world.draw.DrawConstruct;
import animalia.world.draw.DrawItemIO;
import animalia.world.environment.*;
import animalia.world.units.*;
import animalia.world.power.*;
import arc.graphics.Color;
import mindustry.content.Items;
import mindustry.content.Liquids;
import mindustry.gen.Building;
import mindustry.graphics.Pal;
import mindustry.type.Category;
import mindustry.type.ItemStack;
import mindustry.type.LiquidStack;
import mindustry.world.*;
import mindustry.world.blocks.production.GenericCrafter;
import mindustry.world.draw.*;

import static mindustry.type.ItemStack.*;
import static mindustry.content.Fx.*;

public class AniBlocks {
    public static Block
    //environment
    tree,
    //crafting
    bioreactor, carbonizer, eggshellPrinter, geneticReconstructor,
    //production
    chlorophyllSynthesizer,
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
            updateEffectChance = 0f;
            warmupSpeed = 0.01f;
            itemCapacity = 16;
            craftTime = 480;
            size = 3;

            hasItems = true;
            hasLiquids = true;
            outputLiquid = new LiquidStack(AniLiquids.nutritiveSolution, 0.2f);

            drawer = new DrawMulti(
                new DrawRegion("-bottom"),
                new DrawPlasma(){{
                        plasma1 = Color.valueOf("5d50a4");
                        plasma2 = Color.valueOf("5c5e9f");
                    }

                    @Override
                    public void draw(Building build){
                        super.draw(build);

                        if(build.efficiency > 0f && build.timer.get(0, 20)){
                            updateEffect.at(build);
                        }
                    }
                },
                new DrawLiquidRegion(AniLiquids.nutritiveSolution),
                new DrawDefault()
            );

            requirements(Category.crafting, with(Items.lead, 80, Items.silicon, 80, Items.metaglass, 60));

            consumePower(4f);
            consumeItem(Items.sporePod, 4);
            consumeLiquid(Liquids.water, 0.2f);
        }};

        carbonizer = new GenericCrafter("carbonizer"){{
            size = 2;
            hasItems = true;
            hasLiquids = false;

            craftTime = 135f;

            craftEffect = smeltsmoke;
            updateEffect = pulverizeSmall;
            updateEffectChance = 0.008f;

            outputItem = new ItemStack(AniItems.carbonFiber, 1);

            drawer = new DrawMulti(
                new DrawRegion("-bottom"),
                new DrawItemIO(Items.sporePod, AniItems.carbonFiber),
                new DrawGlowRegion("-heat"){{
                    color = Pal.meltdownHit;
                    alpha = 0.7f;
                }},
                new DrawDefault()
            );

            consumePower(3f);
            consumeItem(Items.sporePod, 2);
            requirements(Category.crafting, with(Items.silicon, 90, Items.titanium, 120));
        }};

        eggshellPrinter = new GenericCrafter("eggshell-printer"){{
            size = 2;
            hasItems = true;
            hasLiquids = true;
            itemCapacity = 8;

            craftTime = 360f;
            liquidCapacity = 12f;
            craftEffect = smeltsmoke;
            updateEffect = pulverizeSmall;
            updateEffectChance = 0.008f;

            outputItem = new ItemStack(AniItems.eggshell, 1);

            drawer = new DrawMulti(
                new DrawDefault(),
                new DrawConstruct(b -> outputItem.item.fullIcon),
                new DrawRegion("-top")
            );

            consumePower(0.6f);
            consumeItem(Items.sand, 4);
            consumeLiquid(Liquids.water, 0.1f);
            requirements(Category.crafting, with(Items.copper, 90, Items.lead, 90, Items.silicon, 15));
        }};

        geneticReconstructor = new GeneticReconstructor("genetic-reconstructor"){{
            size = 3;
            itemCapacity = 1;
            hasItems = true;
            hasLiquids = true;

            craftTime = 1000f;
            liquidCapacity = 32f;
            craftEffect = smeltsmoke;

            drawer = new DrawMulti(
                new DrawRegion("-bottom"),
                new DrawBuild(Color.valueOf("a387ea"), b -> b.config() != null ? ((AnimalType) b.config()).egg.fullIcon : null),
                new DrawDefault()
            );

            consumePower(4f);
            consumeItem(AniItems.eggshell, 1);
            consumeLiquid(AniLiquids.nutritiveSolution, 0.2f);
            requirements(Category.crafting, with(Items.silicon, 100, Items.graphite, 140, Items.metaglass, 140));
        }};

        //endregion crafting
        //region production

        chlorophyllSynthesizer = new GenericCrafter("chlorophyll-synthesizer"){{
            size = 2;
            itemCapacity = 8;
            hasItems = true;
            hasLiquids = false;

            craftTime = 200f;
            craftEffect = smeltsmoke;
            updateEffect = pulverizeSmall;
            updateEffectChance = 0.006f;

            outputItem = new ItemStack(AniItems.chlorophyll, 2);

            drawer = new DrawMulti(
                new DrawRegion("-bottom"),
                new DrawBuild(Pal.heal, b -> outputItem.item.fullIcon),
                new DrawDefault()
            );

            consumePower(1.2f);
            consumeLiquid(AniLiquids.nutritiveSolution, 0.1f);
            requirements(Category.production, with(AniItems.carbonFiber, 45, Items.silicon, 45, Items.metaglass, 45));
        }};

        //endregion production
        //region units

        incubator = new Incubator("incubator"){{
            size = 3;

            consumePower(7f);
            requirements(Category.units, with(Items.silicon, 200, Items.metaglass, 140, Items.titanium, 90, AniItems.carbonFiber, 90));
        }};

        //endregion units
        //region power

        dischargeReceptor = new DischargeReceptor("discharge-receptor"){{
            size = 2;

            requirements(Category.power, with(Items.graphite, 60, Items.copper, 60));
        }};

        //endregion power
    }
}
