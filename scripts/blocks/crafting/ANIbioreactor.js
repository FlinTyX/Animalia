const
    fcolor1 = Color.valueOf("9c88c3"),
    fcolor2 = Color.valueOf("a387ea"),

    plasma1 = Color.valueOf("5d50a4"),
    plasma2 = Color.valueOf("5c5e9f")
;

const updateFx = new Effect(74, e => {
    Draw.color(fcolor1, fcolor2, e.fin());

    Angles.randLenVectors(e.id, 14, 35 * e.fout(), (x, y) => {
        let fin = e.fin() * 1.1 * e.fout(Interp.pow10Out);
        
        Fill.circle(e.x + x, e.y + y, 1.2 * fin);
        
        Fill.circle(e.x + x/3, e.y + y/3, fin * 0.8);
    
    });
});

const reactor = extend(LiquidConverter, "bioreactor", {
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
                updateFx.at(this.x, this.y);
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