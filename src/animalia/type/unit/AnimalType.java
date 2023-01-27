package animalia.type.unit;

import animalia.type.Adaption;
import animalia.type.EggType;
import arc.struct.Seq;
import arc.util.Nullable;
import mindustry.gen.EntityMapping;
import mindustry.type.UnitType;
import mindustry.world.Block;

public class AnimalType extends UnitType {
    public Adaption adaption = Adaption.terrestrial;

    public @Nullable EggType egg;

    //variables for spawners
    public float spawnChance = 1; //spawn chance compared to other animals in a spawner
    public boolean sortTeam = false;
    public Seq<Block> spawnsOn = new Seq<>();

    public AnimalType(String name){
        super(name);
    }

    @Override
    public void init() {
        super.init();
        EntityMapping.nameMap.put(name, constructor);
    }

    public boolean isTerrestrial(){
        return adaption == Adaption.terrestrial;
    }

    public boolean isArboreal(){
        return adaption == Adaption.arboreal;
    }
}
