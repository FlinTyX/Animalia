package animalia.type;

import arc.Core;
import mindustry.gen.WeatherState;

public class Consequence {
    public String name;

    public Consequence(String name){
        this.name = Core.bundle.get("consequence.animalia-" + name + ".name");
    }

    public void update(WeatherState state){

    }

    public void init(WeatherState state){

    }
}
