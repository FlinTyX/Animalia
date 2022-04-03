const Cataclysm = require("types/weathers/Cataclysm");

/**ok so this is very RAM intensive, i hope mobile users dont run out of memory */
module.exports = function(name, object){
    this.name = name;

    return new Cataclysm(Weather, this.name, Object.assign({
        timeScale: 700,

        r: 0.18,

        colors: [Pal.remove, Pal.accent],

        remove(){
            this.super$remove();

            if(Vars.state.rules.lighting){
                Vars.state.rules.ambientLight.r = Vars.state.map.rules().ambientLight.r;
            }
        },
        update(state){
            this.super$update(state);
            this.updateConsequences(state);

            const c = Vars.state.rules.ambientLight,
                  r = Math.max(this.r, c.r);

            if(Vars.state.rules.lighting && c.r < r){
                c.r += (r * state.opacity) - c.r;
            }
        },
        drawOver(state){
            this.drawEmbers(1000, state.intensity, state.opacity, this.timeScale, 0.5);
        },
        drawEmbers(density, intensity, opacity, timeScale, minRadius){
            this.rand.setSeed(0);

            Tmp.r1.setCentered(Core.camera.position.x, Core.camera.position.y, Core.graphics.getWidth() / Vars.renderer.minScale(), Core.graphics.getHeight() / Vars.renderer.minScale());
            Tmp.r1.grow(2);
            Core.camera.bounds(Tmp.r2);
            Draw.color(Pal.meltdownHit, opacity);

            const total = Tmp.r1.area() / density * intensity,
                  t = Time.time / timeScale;

            for(let i = 0; i < total; i++){
                let offset = this.rand.random(0, 1),
                    offset2 = this.rand.random(0.8, 1.2),
                    time = t + offset,
                    life = time % 1,

                    f = Math.min(1, life),
                    fout = Interp.pow5Out.apply(Math.max(0, 1 - f)),
                    fin = Interp.fade.apply(Math.min(1, Math.max(0, f * 3))),

                    x = this.rand.random(0, Vars.world.unitWidth()) + Time.time * 0.05,
                    y = this.rand.random(0, Vars.world.unitHeight()) - Time.time * 0.05;
                
                x -= Tmp.r1.x;
                y -= Tmp.r1.y;
                
                x = Mathf.mod(x, Tmp.r1.width);
                y = Mathf.mod(y, Tmp.r1.height);

                x += Tmp.r1.x;
                y += Tmp.r1.y;

                if(Tmp.r3.setCentered(x, y, 10).overlaps(Tmp.r2)){
                    Tmp.v1.trns(0, Mathf.sin((timeScale / 5) * offset2, 18 * offset)).add(x, y);
                    
                    Fill.circle(Tmp.v1.x, Tmp.v1.y, (offset + minRadius) * fin * fout);
                }
            }
        },
    }, object));
}