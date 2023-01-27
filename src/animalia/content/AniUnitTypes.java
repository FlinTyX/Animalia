package animalia.content;

import animalia.entities.units.FrogEntity;
import animalia.type.unit.*;
import arc.func.*;
import arc.struct.*;
import arc.struct.ObjectMap.*;
import mindustry.content.Blocks;
import mindustry.entities.bullet.BasicBulletType;
import mindustry.gen.*;
import mindustry.type.Weapon;

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
    frog, assaultFrog, exoticFrog, glidingFrog;

    public static void load(){
        setupID();

        frog = new FrogType("frog"){{
            targetAir = true;
            targetGround = true;
            usesTongue = true;
            health = 100;

            spawnsOn.add(Blocks.water, Blocks.darksandWater);
        }};

        assaultFrog = new FrogType("assault-frog"){{
            targetAir = true;
            targetGround = true;
            health = 115;
            armor = 2;

            spawnsOn.add(Blocks.water, Blocks.darksandWater);

            weapons.add(new Weapon(name + "-cannon"){{
                x = 0;
                y = -0.2f;

                recoil = 0.5f;
                recoilTime = 5;
                shootY = 3.3f;
                reload = 8;
                mirror = false;
                rotate = true;
                ignoreRotation = true;

                bullet = new BasicBulletType(2.5f, 8){{
                    width = 6;
                    height = 7;
                    lifetime = 60;
                }};
            }});
        }};

        exoticFrog = new PoisonousFrogType("exotic-frog"){{
            mineRange = 15;

            spawnsOn.add(Blocks.taintedWater, Blocks.darksandTaintedWater, Blocks.darksandWater);
        }};

        glidingFrog =  new FrogType("gliding-frog"){{
            targetAir = true;
            targetGround = true;
            usesTongue = true;
            glideTime = 220;
            health = 100;

            spawnsOn.add(Blocks.water, Blocks.darksandWater);
        }};
    }
}
