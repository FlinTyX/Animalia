package animalia.world;

import mindustry.Vars;
import mindustry.world.meta.Attribute;

// TODO h.
public class TemperatureHandler {
    public static Attribute temperature;
    public static int pointer = 0;

    public static void setup(){
        Attribute.add("temperature");
        temperature = Attribute.map.get("temperature");
    }

    public static void init(){

    }

    public static void update(){

    }

    public static float get(){
        return Vars.state.rules.attributes.get(temperature);
    }

    public static float set(float amount){
        Vars.state.rules.attributes.set(temperature, Math.min(100, amount));
        return get();
    }

    public static float add(float amount){
        return set(get() + amount);
    }
}
