const ANIfx = require("libs/ANIfx"),
      ANIitems = require("items/ANIitems"),
      //Bullets
      MultihitOrb = require("types/bullets/MultihitOrb"),
      //Blocks
      DischargeReceptor = require("types/blocks/DischargeReceptor"),
      //Turrets
      LifeDrainTurret = require("types/blocks/turrets/LifeDrainTurret");

module.exports = {
    bioreactor: require("blocks/crafting/ANIbioreactor"),
    carbonizer: require("blocks/crafting/ANIcarbonizer"),
    eggshellPrinter: require("blocks/crafting/ANIeggshell-printer"),
    geneticReconstructor: require("blocks/crafting/ANIgenetic-reconstructor"),
    cataclysmDetector: require("blocks/logic/ANIcataclysm-detector"),
    converter: require("blocks/power/ANIconverter"),
    chlorophyllPanel: require("blocks/production/ANIchlorophyll-panel"),
    chlorophyllSynthesizer: require("blocks/production/ANIchlorophyll-synthesizer"),
    incubator: require("blocks/units/ANIincubator"),
    eggThrower: require("blocks/turrets/ANIegg-thrower"),

    //Class functions

    dischargeReceptor: new DischargeReceptor("discharge-receptor", {
        
    }),

    necrosis: new LifeDrainTurret("necrosis", {}).ammo(
        ANIitems.chlorophyll, new MultihitOrb({})
    ),

    apoptosis: new LifeDrainTurret("apoptosis", {chargeCapacity: 880, drainAmount: 390}).ammo(
        ANIitems.chlorophyll, new MultihitOrb({
            damage: 11,
            speed: 1.3,
            shootEffect: ANIfx.shootReflection1
        })
    ),

    lysis: new LifeDrainTurret("lysis", {
        chargeCount: 4,
        chargeCapacity: 5300,
        drainAmount: 3080,
    
        drawGraph(build, x, y, hitSize){
            const fin = Interp.pow5.apply(Math.max(0, -1 + (build.reload / build.block.reloadTime * 2)));
    
            Draw.z(Layer.effect);
            Draw.color(Tmp.c1.set(Pal.remove).mul(1 + Mathf.absin(Time.time, 3, 0.5)));
    
            Draw.rect(
                this.graphRegion, x, y, hitSize * 2.66, hitSize * 2.66, Time.time * 2
            );
    
            if(fin > 0){
                for(let i = 0; i < 4; i++){
                    Drawf.tri(x, y, hitSize / 2 * fin, hitSize * 3, i * 90 + 10 + (15 * fin));
                }
            }
    
            Draw.alpha(build.reload / build.block.reloadTime);
            Draw.rect(
                this.graphRegion, x, y, hitSize * 1.88, hitSize * 1.88, Time.time * (-2 - build.drained())
            );
    
            Draw.reset();
        }
    }).ammo(ANIitems.chlorophyll, extend(PointBulletType, {
        damage: 2490,
        speed: 150,
        hitShake: 10,
        impact: true,
        knockBack: 10,
        
        trailEffect: Fx.none,
        despawnEffect: Fx.massiveExplosion,
        hitColor: Pal.remove,
    
        hitEffect: new Effect(45, e => {
            //e.data => target's hitsize
            Lines.stroke(1.9 * e.fout(), e.color);
    
            for(let i = 0; i < 4; i++){
                let r = i * 90 + 25;
    
                Drawf.tri(e.x, e.y, e.data / 2 * e.fout(), e.data * (3 + e.fin()), r + (100 + e.fin()) * e.fin()); 
                Drawf.tri(e.x, e.y, e.data / 3 * e.fout(), e.data * 2, r + 180 * e.fout());
            }
    
            e.scaled(7, i => {
                Lines.circle(i.x, i.y, e.data + e.data * 2 * i.fin());
            });
        }),
        hitEntity(b, other, health){
            this.hitEffect.at(b.x, b.y, b.rotation(), this.hitColor, other.hitSize);
            this.hitSound.at(b.x, b.y, this.hitSoundPitch, this.hitSoundVolume);
    
            Effect.shake(this.hitShake, this.hitShake, b);
    
            this.super$hitEntity(b, other, health);
        },
        hit(b){
            //ae
        }
    }))
}