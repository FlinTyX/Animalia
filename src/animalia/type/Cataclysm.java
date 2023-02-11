package animalia.type;

import arc.Core;
import arc.math.Mathf;
import arc.util.Log;
import arc.util.Nullable;
import mindustry.gen.WeatherState;
import mindustry.type.Weather;
import mindustry.world.meta.Stat;

import static animalia.ui.AniUI.*;

public class Cataclysm extends Weather {
    public Consequence[] consequences = {};
    public @Nullable Weather child;

    public float warnDuration = 60 * 6, childSpawnChance = 0.3f;
    public boolean warns = true, updates = false;

    public Cataclysm(String name){
        super(name);

        alwaysUnlocked = true;
    }

    @Override
    public void setStats(){
        super.setStats();

        String text = "";

        if(consequences.length > 0){
            for(Consequence c : consequences) text += c.name + ", ";
            text = text.substring(0, text.length() - 2);
        } else text += "[lightgray]" + Core.bundle.get("none");

        addStats(stats, Stat.health, false, statValue("stat.consequence", text));
    }

    @Override
    public WeatherState create(float intensity, float duration){
        WeatherState state = super.create(intensity, duration);

        initConsequences(state);

        if(warns){
            cataclysmFrag.collapse(build(), warnDuration, consequences);
        }

        return state;
    }

    @Override
    public void update(WeatherState state){
        super.update(state);
        if(updates) updateConsequences(state);
    }

    @Override
    public void remove(){
        if(child != null && Mathf.chanceDelta(childSpawnChance)){
            child.create();
        }

        super.remove();
    }

    @Override
    public boolean isHidden(){
        return false;
    }

    public String build(){
        return Core.bundle.format("weather.animalia-warning", localizedName);
    }

    public void initConsequences(WeatherState state){
        for(Consequence c : consequences){
            c.init(state);
        }
    }

    public void updateConsequences(WeatherState state) {
        for (Consequence c : consequences) {
            c.update(state);
        }
    }
}