package animalia.world.crafting;

import animalia.type.unit.AnimalType;
import arc.graphics.g2d.Draw;
import arc.scene.ui.layout.Table;
import arc.util.Nullable;
import arc.util.Tmp;
import arc.util.io.Reads;
import arc.util.io.Writes;
import mindustry.Vars;
import mindustry.gen.Building;
import mindustry.type.Item;
import mindustry.type.UnitType;
import mindustry.world.blocks.ItemSelection;
import mindustry.world.blocks.production.GenericCrafter;

public class GeneticReconstructor extends GenericCrafter {
    public GeneticReconstructor(String name){
        super(name);

        configurable = true;
        allowConfigInventory = true;
        saveConfig = true;

        configClear(b -> ((GeneticBuild) b).type = null);

        config(UnitType.class, (build, unit) -> {
            if(unitValid(unit)){
                ((GeneticBuild) build).type = (AnimalType) unit;
            }
        });
    }

    public boolean unitValid(UnitType u){
        return (u instanceof AnimalType a) && a.egg != null && !a.isHidden() && !a.isBanned();
    }

    public class GeneticBuild extends GenericCrafter.GenericCrafterBuild {
        public @Nullable AnimalType type;

        @Override
        public boolean shouldConsume(){
            return type != null && !items.has(type.egg);
        }

        @Override
        public void updateTile(){
            super.updateTile();
            dump();
        }

        @Override
        public void craft(){
            consume();

            if(type != null){
                offload(type.egg);
            }

            if(wasVisible){
                craftEffect.at(x, y);
            }

            progress %= 1;
        }

        @Override
        public void buildConfiguration(Table table){
            ItemSelection.buildTable(block, table, Vars.content.units().select(u -> unitValid(u)), this::config, i -> {
                configure(i);
                progress = 0;
            }, false);
        }

        @Override
        public void drawConfigure(){
            super.drawConfigure();

            if(type != null) {
                Tmp.v1.trns(rotdeg(), (block.size / 2 * Vars.tilesize) + Vars.tilesize / 2 + (type.fullIcon.width * Draw.scl * Draw.xscl / 2)).add(x, y);
                Draw.rect(type.fullIcon, Tmp.v1.x, Tmp.v1.y);
            }
        }

        @Override
        public boolean canDump(Building to, Item item){
            return !block.consumesItem(item);
        }

        @Override
        public AnimalType config(){
            return type;
        }

        @Override
        public void write(Writes write){
            super.write(write);
            write.s(type != null ? type.id : -1);
        }

        @Override
        public void read(Reads read, byte revision){
            super.read(read, revision);
            type = (AnimalType) Vars.content.unit(read.s());
        }
    }
}
