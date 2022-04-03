const {randomElement} = require("libs/ANIfunctions"),
      {absorptionSmall} = require("libs/ANIfx"),
      {addStats, statValue} = require("ui/ANIui");

module.exports = function(name, object){
    this.name = name;

    this.turret = object = extend(ItemTurret, this.name, Object.assign({
        category: Category.turret,
        reloadTime: 1, //overrided

        colors: [
            Pal.remove,
            Pal.removeBack,
            Pal.health,
            Pal.noplace,
            Pal.breakInvalid,
            Pal.redderDust
        ],

        chargeCount: 3,
        chargeColor: Pal.health,
        chargeCapacity: 200,
        drainAmount: 65,
        
        load(){
            this.super$load();

            this.graphRegion = Core.atlas.find("animalia-graph1");

            this.chargeRegions = [];
            for(let i = 0; i < this.chargeCount; i++){
                this.chargeRegions[i] = Core.atlas.find(this.name + "-charge" + i);
            }
        },
        init(){
            this.super$init();
            this.reloadTime = this.drainAmount + (60 / this.chargeCount);
        },
        setStats(){
            this.super$setStats();

            function base(a, b){
                return "[lightgray]" + Core.bundle.get("stat.drain") + " " + Core.bundle.get(a.toString()) + ":[] " + b;
            }

            addStats(this.stats, Stat.reload, true, [
                base("filter.option.amount", this.drainAmount + "[lightgray] " + Core.bundle.get("unit.persecond")),
                statValue("stat.draincapacity", this.chargeCapacity)
            ]);
        },
        setBars(){
            this.super$setBars();

            this.bars.add("progress", e => new Bar(
                "bar.drained",
                Pal.remove, 
                () => e.drained()
            ));
        },
        drawGraph(build, x, y, hitSize){
            Draw.z(Layer.effect);
            Draw.color(Tmp.c1.set(Pal.remove).mul(1 + Mathf.absin(Time.time, 3, 0.5)));

            Draw.rect(
                this.graphRegion, x, y, hitSize * 2.66, hitSize * 2.66, Time.time * 2
            );

            Draw.reset();
        }
    }, object));

    this.turret.buildType = () => extend(ItemTurret.ItemTurretBuild, this.turret, {
        charge: 0,
        counter: 0,

        chargeValid(){
            return this.target != null && this.isShooting() && this.hasAmmo();
        },
        drain(){
            const amount = Math.min(this.target.health + 0.1, (object.drainAmount / 60) * this.timeScale);

            this.target.damage(amount);
            this.charge += Math.min(this.target.health, amount); //it didnt increase charge when shielded units so i just made it simplier
        },
        drained(){
            return Math.min(1, ((object.chargeCapacity / object.chargeCount * this.counter) + this.charge) / object.chargeCapacity);
        },
        updateTile(){
            this.super$updateTile();
            this.heat = Mathf.lerpDelta(this.heat, Mathf.num(this.target != null && this.chargeValid()), 0.05);

            if(this.chargeValid()){
                if(this.charge >= object.chargeCapacity / object.chargeCount){
                    this.charge = 0;
                    this.counter++;
                } else this.drain();

                if(Mathf.chanceDelta(object.chargeCount/10)){
                    absorptionSmall.at(
                        this.target.x, 
                        this.target.y, 
                        Math.random() * 360, 
                        randomElement(object.colors), 
                        {
                            target: this, 
                            size: this.target instanceof Building ? this.target.block.size * Vars.tilesize * 1.5 : this.target.hitSize * 1.5,
                            trail: new Trail(6)
                        }
                    );
                }
            }
        },
        draw(){
            this.super$draw();

            if(this.chargeValid() && this.heat > 0.001){
                object.drawGraph(Object.create(this), this.target.x, this.target.y, this.target instanceof Building ? this.target.block.size * Vars.tilesize : this.target.hitSize);
            }

            if(object.chargeRegions.length > 0 && (this.counter > 0 || this.charge > 0.001)){

                Tmp.v1.trns(this.rotation, -this.recoil).add(this);
                Draw.z(Layer.turret + 0.1);
                Draw.blend(Blending.additive);

                for(let i = 0; i < this.counter + 1; i++){
                    if(object.chargeRegions[i] != undefined && object.chargeRegions[i].found()){
                        Draw.color(object.chargeColor);

                        if(i == this.counter){
                            //lil fade
                            Draw.alpha(this.charge / (object.chargeCapacity / object.chargeCount));
                        }

                        Draw.rect(object.chargeRegions[i], Tmp.v1.x, Tmp.v1.y, this.rotation - 90);
                    }
                }

                Draw.blend();
                Draw.reset();
            }
        },
        shoot(type){
            if(this.counter >= object.chargeCount){
                this.super$shoot(type);
                this.counter = 0;
                this.charge = 0;
            }
        },
        baseReloadSpeed(){
            return this.super$baseReloadSpeed() * Mathf.num(!this.isControlled());
        },
        write(write){
            this.super$write(write);
            write.f(this.charge);
            write.i(this.counter);
        },
        read(read, revision){
            this.super$read(read, revision);
            this.charge = read.f();
            this.counter = read.i();
        }
    });

    return this.turret;
}