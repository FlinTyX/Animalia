const Cataclysm = require("types/weathers/Cataclysm"),
      {screenLightning} = require("libs/ANIfx"),
      {thunder1} = require("libs/ANIsounds");

module.exports = function(name, object){
    this.name = name;

    return new Cataclysm(ParticleWeather, this.name, Object.assign({
        lightningSound: thunder1,
        lightningChance: 0.012,
        rainSizeMin: 18,
        rainSizeMax: 40,
        rainDensity: 950,
        rainColor: Color.valueOf("7a95eaff"),
        stroke: 0.75,

        xspeed: -8,
        yspeed: -12,
        sizeMin: 75,
        sizeMax: 100,
        minAlpha: 0.02,
        maxAlpha: 0.12,
        baseSpeed: 6.2,
        density: 20000,
        padding: 18,
        force: 1,
        soundVol: 0.9,
        duration: 7.5 * Time.toMinutes,

        particleRegion: "particle",
        color: Color.valueOf("a1b1d0"),
        drawNoise: false,
        useWindVector: true,
        status: StatusEffects.wet,
        sound: Sounds.rain,
    
        load(){
            this.super$load();
    
            this.region = Core.atlas.find(this.particleRegion);

            this.splashes = [];
            for(let i = 0; i < 12; i++){
                this.splashes[i] = Core.atlas.find("splash-" + i);
            }
        },
        update(state){
            if(Mathf.chanceDelta(this.lightningChance * state.opacity * state.intensity / 2)){
                screenLightning.at(Core.camera.position.x, Core.camera.position.y);

                if(Mathf.chanceDelta(1 - (this.lightningChance * 10))){
                    let mag = Math.random() * 5;

                    if(mag > 1 && !Vars.headless) Vars.renderer.shake(mag, mag * 2);

                    if(mag > 3.5){
                        this.lightningSound.play(mag / 5, 0.6 + Math.random() * 0.5, Mathf.random(-0.5, 0.5));

                        if(Mathf.chanceDelta(0.5)) this.updateConsequences(state);
                    }
                }
            }
        },
        drawOver(state){
            this.drawRain(this.rainSizeMin, this.rainSizeMax, -this.xspeed, -this.yspeed, this.rainDensity, state.intensity, this.stroke + 0.1, this.rainColor);
            this.super$drawOver(state);
        },
        drawUnder(state){
            this.drawSplashes(this.splashes, 40, this.rainDensity * 1.15, state.intensity, state.opacity, this.padding, this.stroke, this.rainColor, Liquids.water);
        }
    }, object));
}