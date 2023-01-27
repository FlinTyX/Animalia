package animalia.type;

import animalia.type.unit.AnimalType;
import arc.func.Boolf;
import arc.math.Mathf;
import arc.struct.Seq;
import arc.util.Log;
import mindustry.Vars;
import mindustry.world.Tile;

public class GroupSpawner {
    public static Seq<GroupSpawner> spawners = new Seq<>();
    public Seq<SpawnableAnimal> types = new Seq<>();
    public float spawnChance = 0.00002f;

    public GroupSpawner(){
        spawners.add(this);
    }

    public void update(Tile t){
        if(invalidateSpawn(t)) return;

        for(SpawnableAnimal s : types) {
            if (validateSpawn(t, s)) {
                s.map.add(t);
            }
        }
    }

    public Seq<Tile> tileLinked8(Tile t, Boolf<Tile> bool){
        Seq<Tile> tiles = new Seq<>();

        for(int x = -1; x < 2; x++){
            for(int y = -1; y < 2; y++){
                Tile tile = Vars.world.tile(t.x + x, t.y + y);
                if(tile != null && tile != t && bool.get(tile)) tiles.add(tile);
            }
        }

        return tiles;
    }

    public SpawnableAnimal sort(){
        Seq<SpawnableAnimal> valids = types.select(s -> s.canSpawn());
        Seq<Float> chances = new Seq<>();

        float total = 0;

        for(int i = 0; i < valids.size; i++){
            float v = valids.get(i).type.spawnChance;

            chances.add(v);
            total += v;
        }

        float r = Mathf.random(total);
        int i = 0;

        while(r > chances.get(i)){
            r -= chances.get(i);
            i++;
        }

        return valids.get(i);
    }

    public void spawn(){

    }

    public void push(AnimalType type){
        types.add(new SpawnableAnimal(type));
    }

    public boolean invalidateSpawn(Tile t){
        return t.solid() || !t.floor().isLiquid;
    }

    public boolean validateSpawn(Tile t, SpawnableAnimal s){
        return s.type.spawnsOn.contains(t.floor()) &&
                tileLinked8(t, tile -> !tile.solid() && !tile.floor().isLiquid).size > 0;
    }

    public static class SpawnableAnimal {
        public AnimalType type;
        public Seq<Tile> map = new Seq<>();

        public SpawnableAnimal(AnimalType type){
            this.type = type;
        }

        public boolean canSpawn(){
            return type.unlocked() || !Vars.state.isCampaign();
        }
    }
}
