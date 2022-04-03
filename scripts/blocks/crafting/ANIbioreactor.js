const {bioreactorEffect} = require("libs/ANIfx");

const fcolor1 = Color.valueOf("9c88c3"),
      fcolor2 = Color.valueOf("a387ea"),
      plasma1 = Color.valueOf("5d50a4"),
      plasma2 = Color.valueOf("5c5e9f");

const reactor = module.exports = extend(LiquidConverter, "bioreactor", {
    updateEffectChance: 0,

    load(){
        this.super$load();
        this.bottomRegion = Core.atlas.find(this.name + "-bottom");
    },
    icons(){
        return [
            this.bottomRegion,
            this.region
        ]
    }
});

reactor.buildType = () => extend(LiquidConverter.LiquidConverterBuild, reactor, {
    updateTile(){
        this.super$updateTile();
        
        if(this.consValid()){
            if(this.timer.get(0, 20)){
                bioreactorEffect.at(this.x, this.y, 0, fcolor1, fcolor2);
            }
        }
    },
    draw(){
        Draw.rect(reactor.bottomRegion, this.x, this.y);

        for(let i = 0; i < Blocks.impactReactor.plasmaRegions.length; i++){
            let r = this.block.size * Vars.tilesize - 3 + Mathf.absin(Time.time, 2 + i * 1, 5 - i * 0.5);

            Draw.color(plasma1, plasma2, i / Blocks.impactReactor.plasmaRegions.length);
            Draw.alpha((0.3 + Mathf.absin(Time.time, 2 + i * 2, 0.3 + i * 0.05)) * this.warmup);
            Draw.blend(Blending.additive);
            Draw.rect(Blocks.impactReactor.plasmaRegions[i], this.x, this.y, r, r, Time.time * (12 + i * 6) * this.warmup);
            Draw.blend();
        }

        Draw.color();

        Draw.rect(reactor.region, this.x, this.y);

        Draw.reset();
    }
});