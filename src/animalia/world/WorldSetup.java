package animalia.world;

import animalia.content.AniBlocks;
import animalia.content.AniWeathers;
import animalia.type.GroupSpawner;
import arc.Core;
import arc.math.Mathf;
import mindustry.game.Team;
import mindustry.gen.Call;
import mindustry.world.Tile;

import static animalia.type.GroupSpawner.spawners;
import static mindustry.Vars.*;
import static mindustry.Vars.state;

public class WorldSetup {
    public TemperatureHandler temperature;

    public static int mapTrees = 4, trees = 0;

    public static void onLoad(){
        for(GroupSpawner spawner : spawners){
            for(GroupSpawner.SpawnableAnimal s : spawner.types) s.map.clear();
        }

        world.tiles.eachTile(t -> {
            for (GroupSpawner s : spawners) {
                s.update(t);
            }
        });
    }

    public static void onCreate(){
        if(Core.settings.getBool("entryweathers") || state.isCampaign()){
            AniWeathers.entry();
        }

        updateEnvironment();

        world.tiles.eachTile(t -> {
            updateEnvironment(t);
        });
    }

    public static void update() {
        spawners.each(s -> {
            if (s.types.size > 0 && state.isPlaying()) {
                if (Mathf.chanceDelta(s.spawnChance)) {
                    s.spawn();
                }
            }
        });
    }

    public static void updateEnvironment(){
        int q = 0, maxQ = Math.max(world.width(), world.height());

        while(q++ <= maxQ && trees <= mapTrees){
            int x = Math.round((float) Math.random() * world.width()),
                y = Math.round((float) Math.random() * world.height());

            Tile t = world.tile(x, y);

            if(t != null && !t.solid()){
                if(t.floor().name.contains("grass")){
                    Call.setTile(t, AniBlocks.tree, Team.derelict, 0);
                    trees++;
                }
            }
        }

        trees = 0;
    }

    public static void updateEnvironment(Tile tile){

    }
}
