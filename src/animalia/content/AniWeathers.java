package animalia.content;

import arc.struct.Seq;
import arc.util.Time;
import mindustry.content.Weathers;
import mindustry.type.Weather;
import mindustry.world.meta.Attribute;
import animalia.type.Consequence;
import animalia.type.weather.StormCataclysm;

import static mindustry.Vars.*;

public class AniWeathers {
    public static Weather
    storm,
    tropicalStorm;

    public static void load(){
        storm = new StormCataclysm("storm"){{
            warns = false;
            updates = true;

            child = tropicalStorm;

            attrs.set(Attribute.light, -0.3f);
            attrs.set(Attribute.water, 0.4f);
        }};

        tropicalStorm = new StormCataclysm("tropical-storm"){{
            consequences = new Consequence[]{new Consequences.Thunder()};

            rainDensity = 440f;
            rainSizeMin = 25f;
            rainSizeMax = 40f;

            xspeed = -10;
            yspeed = -16f;
            stroke = 0.8f;
            soundVol = 0.8f;
            duration = 6 * Time.toMinutes;
            padding = 40f;
            force = 0.6f;
            density = 10000f;

            attrs.set(Attribute.light, -0.6f);
            attrs.set(Attribute.water, 0.7f);
        }};
    }

    public static boolean hasWeather(Weather... all){
        Seq<Weather> copy = new Seq<>(all);

        return state.rules.weather.select(e -> copy.contains(e.weather)).size > 0;
    }

    public static void addWeather(Weather[] weather, boolean[] valid){
        for(int i = 0; i < weather.length; i++){
            if(valid[i] && !hasWeather(weather[i])){
                state.rules.weather.add(new Weather.WeatherEntry(weather[i]));
            }
        }
    }

    public static void entry(){
        addWeather(
            new Weather[]{
                storm
            },
            new boolean[]{
                hasWeather(Weathers.rain, Weathers.snow)
            }
        );
    }
}
