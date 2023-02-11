package animalia.content;

import animalia.entities.units.FrogEntity;
import animalia.type.GroupSpawner;
import arc.struct.Seq;
import mindustry.Vars;
import mindustry.gen.Unit;
import mindustry.world.Tile;

public class Spawners {
    public static GroupSpawner

    frog = new GroupSpawner(){
        @Override
        public void spawn(){
            SpawnableAnimal s = sort();

            if(s != null) {
                s.map.filter(e -> e.build == null && tileLinked8(e, tile -> !tile.solid() && !tile.floor().isLiquid).size > 0);

                if (s.map.size > 0) {
                    Tile t = s.map.random();
                    Seq<Tile> tiles = tileLinked8(t, tile -> !tile.solid() && !tile.floor().isLiquid);

                    s.type.unlock();

                    Unit u = s.type.spawn(Vars.state.rules.defaultTeam, t.worldx(), t.worldy());

                    //look at a random tile around the liquid
                    u.lookAt(tiles.random());

                    //make the frog jump on it
                    ((FrogEntity) u).jump(0);
                }
            }
        }
    };
}
