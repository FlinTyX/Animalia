const {closestPlayer} = require("libs/ANIfunctions");

module.exports = {
    landSmoke: new Effect(25, e => {
        Draw.color(Pal.gray, Pal.lightishGray, e.finpow());
    
        Angles.randLenVectors(e.id, 4, 10 * e.fin(), (x, y) => {
            Fill.circle(e.x + x, e.y + y, 1.2 * e.fslope());
        });
    }),

    hatchSmoke: new Effect(20, e => {
        Draw.color(e.color, Pal.lightishGray, e.fin());
    
        Angles.randLenVectors(e.id, 8, 6 * e.finpow(), (x, y) => {
            Fill.circle(e.x + x, e.y + y, 1.15 * e.fslope());
        });
    }),

    absorptionSmall: new Effect(55, 500, e => {
        const fin = e.fout(Interp.pow10Out) * Math.min(e.fin(Interp.pow10Out) * 2, 1);

        Tmp.v2.trns(e.data.target.rotation, e.data.target.block.shootLength - e.data.target.recoil).add(e.data.target.x, e.data.target.y);
        const angle = Angles.angle(e.x, e.y, Tmp.v2.x, Tmp.v2.y);
    
        Tmp.v1.trns(angle, Mathf.dst(e.x, e.y, Tmp.v2.x, Tmp.v2.y) * e.fin(Interp.fade)).add(e.x, e.y);
        Tmp.v2.trns(e.rotation, e.data.size * e.fout(Interp.sineIn)).add(Tmp.v1.x, Tmp.v1.y);
    
        if(!Vars.state.isPaused()) e.data.trail.update(Tmp.v2.x, Tmp.v2.y);
        e.data.trail.draw(e.color, fin * 0.8);
    
        Draw.color(e.color);
        Fill.circle(Tmp.v2.x, Tmp.v2.y, fin);
    }),

    screenLightning: new Effect(30, e => {
        e.scaled(15 + Mathf.randomSeed(e.id, 10), i => {

            Draw.color(e.color, Pal.spore, i.fin());
            Draw.alpha(Mathf.randomSeed(i.id, 0.8) * i.fout());
            Fill.square(i.x, i.y, Core.camera.width, Core.camera.height);

        });
    }),

    bioreactorEffect: new Effect(70, e => {
        Draw.color(e.color, e.data, e.fin());
    
        Angles.randLenVectors(e.id, 14, 35 * e.fout(), (x, y) => {
            const fin = e.fin() * 1.1 * e.fout(Interp.pow10Out);
            
            Fill.circle(e.x + x, e.y + y, 1.2 * fin);
            Fill.circle(e.x + x/3, e.y + y/3, fin * 0.8);
        });
    }),

    fireflyTrail: new Effect(75, e => {
        Draw.color(e.color);
        Fill.circle(e.x, e.y, e.rotation * e.fout());
    }),

    lightTrail1: new Effect(180, e => {
        if(!e.data) return;

        Tmp.v1.trns(e.rotation, e.data * e.fout(Interp.pow10In));

        Drawf.light(Team.derelict, e.x - Tmp.v1.x, e.y - Tmp.v1.y, e.x, e.y, 16, e.color, 0.6 - (0.3 * e.fin()));
    }),

    unitRemove: new Effect(10, e => {
        const {rotation, region} = e.data;

        const m = e.fout() * Draw.scl;
        const w = region.width * m * Draw.xscl;
        const h = region.height * m * Draw.yscl;

        Tmp.v1.trns(e.rotation, e.fin() * (region.height * Draw.scl * 0.4)).add(e.x, e.y);

        Draw.z(Layer.groundUnit);
        Draw.rect(region, Tmp.v1.x, Tmp.v1.y, w, h, rotation - 90);
    }),

    //this sucks, but it works
    tongueAttack: new Effect(180, 500, e => {
        if(!e.data.unit || !e.data.target || !e.data.target.isValid()) return;

        const {unit, target} = e.data,
              anglet = target.angleTo(unit),
              dst = unit.dst2(target);

        //e
        unit.lookAt(unit.angleTo(target.x, target.y));
        target.vel.set(0, 0);
        target.impulse(Tmp.v1.trns(anglet, dst * 0.6));

        Tmp.v1.trns(unit.rotation, unit.hitSize / 2).add(unit);

        Lines.stroke(1.4, Color.valueOf("c45f5f"));
        Lines.line(Tmp.v1.x, Tmp.v1.y, target.x, target.y);
        Fill.circle(target.x, target.y, 1.6);

        if(target.within(unit, target.hitSize * 1.3)){

            module.exports.unitRemove.at(target.x, target.y, anglet, {rotation: target.rotation, region: target.icon()});
            target.remove();

        }
    }),

    fireflySpawn: new Effect(60 * 6, 500, e => {
        if(!e.data.target) return;

        const t = e.data.target, p = closestPlayer(t.team, t.x, t.y);
        
        const fin = Math.min(1, (e.time / 0.2) / (e.lifetime * 0.2));
        const fout = e.fout(Interp.pow10Out);

        Draw.color(Tmp.c1.set(Pal.heal).mul(1 + Mathf.absin(Time.time, 4, 0.5)));

        if(p != t && p != null){
            const angle = p.angleTo(e.data.target);
            const rad = p.hitSize * 1.4;

            Tmp.v1.trns(angle, rad + 7 * fin * e.finpow()).add(p);

            Drawf.light(p.x, p.y, p.type.lightRadius + p.type.lightRadius * fin * e.finpow() * fout, Pal.heal, fin * fout);

            Lines.stroke(fin * fout);
            Lines.poly(p.x, p.y, 24, rad + e.finpow() * 3);

            if(!(t instanceof NullUnit) && t.isValid()){
                Drawf.tri(Tmp.v1.x, Tmp.v1.y, rad/4 * fin * fout, rad/2.5, angle);

                Drawf.light(t.x, t.y, t.hitSize * 6 * fin * e.finpow(), Pal.plastanium, fout);
                Lines.poly(t.x, t.y, 24, t.hitSize + e.finpow() * 3);
            }
        }
    }),

    shootReflection1: new Effect(38, e => {
        let h = 80 + 25 * e.fin(), 
            w = 4 * e.fout(), 
            rot = 5 * e.finpow() * Mathf.randomSeed(e.id, -1, 1), 
            rot2 = -10 * e.fin() * Mathf.randomSeed(e.id * 2, 1, -1);

        Lines.stroke(1.8 * e.fout(), Pal.remove);
        Drawf.tri(e.x, e.y, w, h, rot);
        Drawf.tri(e.x, e.y, w, h, rot + 180);

        w /= 1.5, h /= 1.5;

        Drawf.tri(e.x, e.y, w, h, rot2);
        Drawf.tri(e.x, e.y, w, h, rot2 + 180);

        Lines.poly(e.x, e.y, 20, 8 - e.fin());
        Lines.poly(e.x, e.y, 28, 12.5 + 6 * e.finpow());
        Fill.circle(e.x, e.y, 2.5 * e.fout());

        Angles.randLenVectors(e.id, 10, 22 + e.fin(), (x, y) => {
            Fill.circle(e.x + x, e.y + y, 0.8 * e.fout());
        });

        Angles.randLenVectors(e.id, 10, 15 + (4 * e.fin()), (x, y) => {
            Fill.circle(e.x + x, e.y + y, e.fout());
        });

        e.scaled(9, i => {
            Lines.stroke(e.fout());
            Lines.circle(i.x, i.y, 26 * i.fin());
        });
    }),

    thunder1: new Effect(40, 500, e => {
        let w = 15 * e.fout(), 
            w2 = w / 2,
            w3 = w2 * 0.7,
            h = 130, 
            r = Mathf.randomSeed(e.id, -2, 2) * e.fin(), 
            ox = Core.camera.width / 2;

        Draw.color(Pal.lancerLaser, Color.purple, e.fin());
        Drawf.tri(e.x, e.y, w, h, r);
        Drawf.tri(e.x, e.y, w, h, r + 180);
        
        Fill.circle(e.x, e.y, 14 * e.fout());
        Fill.quad(e.x + w2, e.y, e.x - w2, e.y, e.x - w2 * 3, e.y + ox, e.x + w2 * 3, e.y + ox);
        
        Draw.color();
        Fill.quad(e.x + w3, e.y, e.x - w3, e.y, e.x - w3 * 3, e.y + ox, e.x + w3 * 3, e.y + ox);
        Draw.color(Pal.meltdownHit, Pal.spore, e.fin());

        Angles.randLenVectors(e.id, 15, 40 + 40 * e.finpow(), (x, y) => {
            Fill.circle(e.x + x, e.y + y, 0.8 * e.fout());
        });

        Angles.randLenVectors(e.id, 15, 60 + (40 * e.fin()), (x, y) => {
            Fill.circle(e.x + x, e.y + y, e.fout());
        });

        e.scaled(10, i => {
            Lines.stroke(4 * i.fout());
            Lines.circle(i.x, i.y, 90 * i.fin());
            Lines.circle(i.x, i.y, 50 * e.fout());
        });
    })
}

module.exports.landSmoke.layer = Layer.groundUnit - 1;
module.exports.hatchSmoke.layer = Layer.block + 0.001;
module.exports.screenLightning.layer = Layer.end;
module.exports.unitRemove.layer = Layer.groundUnit;
module.exports.tongueAttack.layer = Layer.groundUnit + 0.01;