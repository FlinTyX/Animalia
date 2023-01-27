package animalia.world;

import animalia.content.AniWeathers;
import animalia.type.GroupSpawner;
import arc.Events;
import arc.math.Mathf;
import arc.util.Time;
import mindustry.game.EventType;

import static animalia.type.GroupSpawner.spawners;
import static mindustry.Vars.*;
import static mindustry.Vars.state;

public class WorldSetup {
    public TemperatureHandler temperature;

    public static void setup(){
        Events.on(EventType.WorldLoadEvent.class, e -> Time.run(5, () -> {
            if (state.isMenu() || net.client()) return;

            //setup weather
            AniWeathers.entry();

            //setup spawners
            for(GroupSpawner spawner : spawners){
                for(GroupSpawner.SpawnableAnimal s : spawner.types) s.map.clear();
            }

            world.tiles.eachTile(t -> {
                for(GroupSpawner s : spawners){
                    s.update(t);
                }
            });
        }));
    }

    public static void update(){
        spawners.each(s -> {
            if (s.types.size > 0 && state.isPlaying()) {
                if (Mathf.chanceDelta(s.spawnChance)) {
                    s.spawn();
                }
            }
        });
    }
}
