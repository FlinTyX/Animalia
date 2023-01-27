package animalia.type.weather;

import arc.Core;
import arc.audio.Sound;
import arc.graphics.Color;
import arc.graphics.g2d.TextureRegion;
import arc.math.Mathf;
import arc.util.Time;
import mindustry.Vars;
import mindustry.content.Liquids;
import mindustry.content.StatusEffects;
import mindustry.gen.Sounds;
import mindustry.gen.WeatherState;
import mindustry.graphics.Pal;
import mindustry.type.Liquid;
import animalia.content.AniFx;
import animalia.sound.AniSounds;

import static animalia.Animalia.sfxvol;

public class StormCataclysm extends ParticleCataclysm {
    public float lightningChance = 0.012f, rainSizeMin = 18f, rainSizeMax = 40f, rainDensity = 900f, stroke = 0.8f;
    public Liquid liquid = Liquids.water;
    public TextureRegion[] splashes = new TextureRegion[12];
    public Color rainColor = Color.valueOf("7a95eaff");
    public Sound lightningSound = AniSounds.thunder1;

    public StormCataclysm(String name){
        super(name);

        yspeed = -9f;
        xspeed = -10f;
        density = 20000f;
        minAlpha = 0.02f;
        maxAlpha = 0.12f;
        sizeMin = 75f;
        sizeMax = 100f;

        baseSpeed = 6.2f;
        force = 0.3f;
        soundVol = 0.9f;
        padding = 18f;
        duration = 9f * Time.toMinutes;

        particleRegion = "particle";
        color = Color.valueOf("a1b1d0ff");
        drawNoise = false;
        useWindVector = true;
        status = StatusEffects.wet;
        sound = Sounds.rain;
    }

    @Override
    public void load(){
        super.load();

        for(int i = 0; i < splashes.length; i++) {
            splashes[i] = Core.atlas.find("splash-" + i);
        }
    }

    @Override
    public void update(WeatherState state){
        super.update(state);

        if(Mathf.chanceDelta(lightningChance * state.opacity * state.intensity / 2)){
            AniFx.lightning.at(Core.camera.position.x, Core.camera.position.y, Pal.lancerLaser);

            if(Mathf.chanceDelta(1 - (lightningChance * 10))){
                float mag = (float) Math.random() * 5;

                if(mag > 1f && !Vars.headless) Vars.renderer.shake(mag, mag * 2);

                if(mag > 3.5f){
                    lightningSound.play(sfxvol(mag / 5), 0.6f + (float) Math.random() * 0.5f, Mathf.random(-0.5f, 0.5f));

                    if(Mathf.chanceDelta(0.5f)) updateConsequences(state);
                }
            }
        }
    }

    @Override
    public void drawOver(WeatherState state){
        drawRain(rainSizeMin, rainSizeMax, -xspeed, -yspeed, rainDensity, state.intensity, stroke, rainColor);
        super.drawOver(state);
    }

    @Override
    public void drawUnder(WeatherState state){
        drawSplashes(splashes, sizeMax, rainDensity * 1.15f, state.intensity, state.opacity, padding, stroke, rainColor, liquid);
    }
}
