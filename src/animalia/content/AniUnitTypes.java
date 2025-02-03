package animalia.content;

import animalia.entities.units.FrogEntity;
import animalia.type.FrogWeapon;
import animalia.type.unit.*;
import arc.func.*;
import arc.graphics.Color;
import arc.graphics.g2d.Draw;
import arc.math.Mathf;
import arc.struct.*;
import arc.struct.ObjectMap.*;
import arc.util.Time;
import arc.util.Tmp;
import mindustry.content.Blocks;
import mindustry.entities.bullet.BasicBulletType;
import mindustry.gen.*;

import static animalia.sound.AniSounds.*;

@SuppressWarnings("unchecked")
public class AniUnitTypes {
    //Stolen from prog-mats, which Meep originally stole from Endless Rusting and BM

    private static final Entry<Class<? extends Entityc>, Prov<? extends Entityc>>[] types = new Entry[]{
        prov(FrogEntity.class, FrogEntity::new)
    };

    private static final ObjectIntMap<Class<? extends Entityc>> idMap = new ObjectIntMap<>();

    /**
     * Internal function to flatmap {@code Class -> Prov} into an {@link Entry}.
     * @author GlennFolker
     */
    private static <T extends Entityc> Entry<Class<T>, Prov<T>> prov(Class<T> type, Prov<T> prov){
        Entry<Class<T>, Prov<T>> entry = new Entry<>();
        entry.key = type;
        entry.value = prov;
        return entry;
    }

    /**
     * Setups all entity IDs and maps them into {@link EntityMapping}.
     * @author GlennFolker
     */

    private static void setupID(){
        for(
                int i = 0,
                j = 0,
                len = EntityMapping.idMap.length;

                i < len;

                i++
        ){
            if(EntityMapping.idMap[i] == null){
                idMap.put(types[j].key, i);
                EntityMapping.idMap[i] = types[j].value;

                if(++j >= types.length) break;
            }
        }
    }

    /**
     * Retrieves the class ID for a certain entity type.
     * @author GlennFolker
     */
    public static <T extends Entityc> int classID(Class<T> type){
        return idMap.get(type, -1);
    }

    public static FrogType
    frog, assaultFrog, leopardFrog, exoticFrog, glidingFrog, phroge;

    public static void load(){
        setupID();

        frog = new FrogType("frog"){{
            alwaysUnlocked = true;
            ambientSound = ribbit1;
            targetAir = true;
            usesTongue = true;
            health = 100;

            spawnsOn.add(Blocks.water, Blocks.darksandWater);
        }};

        assaultFrog = new FrogType("assault-frog"){{
            ambientSound = ribbit2;
            targetAir = true;
            targetGround = true;
            mineRange = 40;
            health = 115;
            armor = 2;

            spawnsOn.add(Blocks.water, Blocks.darksandWater);

            weapons.add(new FrogWeapon("animalia-assault-cannon"){{
                x = 0;
                y = -0.2f;

                recoil = 0.5f;
                recoilTime = 5;
                shootY = 3.3f;
                reload = 8;
                mirror = false;
                rotate = true;
                ignoreRotation = true;

                bullet = new BasicBulletType(2.5f, 6) {{
                    width = 6;
                    height = 7;
                    lifetime = 60;
                }};
            }});
        }};

        leopardFrog = new FrogType("leopard-frog"){{
            ambientSound = ribbit2;
            targetAir = true;
            targetGround = true;
            usesTongue = true;
            health = 100;
            armor =  2;
            speed = 0.65f;

            jumpTime = 35;
            jumpSize = 6.5f;
            jumpChance  = 0.004f;
            swimTime = 120;
            spawnChance = 0.8f;

            spawnsOn.add(Blocks.water, Blocks.darksandWater);
        }};

        exoticFrog = new PoisonousFrogType("exotic-frog"){{
            ambientSound = ribbit1;
            mineRange = 10;

            spawnsOn.add(Blocks.taintedWater, Blocks.darksandTaintedWater, Blocks.darksandWater);
        }};

        /*
        glidingFrog =  new FrogType("gliding-frog"){{
            ambientSound = ribbit1;
            targetAir = true;
            targetGround = true;
            usesTongue = true;
            glideTime = 220;
            health = 100;

            spawnsOn.add(Blocks.water, Blocks.darksandWater);
        }};
         */

        phroge = new FrogType("phroge"){{
            spawnChance = 0.002f;
            health = 230;

            spawnsOn.add(Blocks.water, Blocks.darksandWater);
        }
            @Override
            public void applyColor(Unit unit){
                super.applyColor(unit);
                Draw.color(Tmp.c1.set(Color.pink).shiftHue(Time.time * (3f + Mathf.randomSeed(unit.id, 1))), 1f);
            }
        };
    }
}
