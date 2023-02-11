package animalia.type.unit;

import animalia.type.Adaption;
import animalia.type.EggType;
import arc.audio.Sound;
import arc.math.Mathf;
import arc.struct.Seq;
import arc.util.Nullable;
import mindustry.Vars;
import mindustry.core.GameState;
import mindustry.gen.EntityMapping;
import mindustry.gen.Unit;
import mindustry.type.UnitType;
import mindustry.world.Block;

import static animalia.content.AniFx.animalSound;
import static  animalia.Animalia.sfxvol;

//TODO add abilities & invisibility
public class AnimalType extends UnitType {
    public Adaption adaption = Adaption.terrestrial;

    public @Nullable EggType egg;
    public @Nullable Sound ambientSound;
    public Seq<Block> spawnsOn = new Seq<>();

    public float spawnChance = 1, ambientSoundVol = 0.2f, soundPlayChance =  0.0005f;
    public boolean sortTeam = false;

    public AnimalType(String name){
        super(name);
    }

    @Override
    public void init() {
        super.init();
        EntityMapping.nameMap.put(name, constructor);
    }

    @Override
    public void update(Unit unit){
        super.update(unit);

        //TODO multiple ambient sounds?
        if(ambientSound != null && Mathf.chanceDelta(soundPlayChance)){
            ambientSound.at(unit.x, unit.y, 0, sfxvol(ambientSoundVol));

            if(Mathf.chance(0.5f)){
                animalSound.at(unit.x, unit.y, unit.rotation);
            }
        }
    }

    public boolean isTerrestrial(){
        return adaption == Adaption.terrestrial;
    }

    public boolean isArboreal(){
        return adaption == Adaption.arboreal;
    }
}
