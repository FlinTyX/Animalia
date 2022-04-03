module.exports = function(name, object){
    this.name = name;

    this.block = object = extend(PowerBlock, this.name, Object.assign({
        category: Category.power,
        sync: true,

        range: 180,
        offsetY: 4.4,
        shadowSize: 22,

        load(){
            this.super$load();

            this.softShadowRegion = Core.atlas.find("circle-shadow");
            this.rodRegion = Core.atlas.find(this.name + "-rod");
            this.heatRegion = Core.atlas.find(this.name + "-heat");
        },
        setStats(){
            this.super$setStats();
            this.stats.remove(Stat.powerUse);
        },
        drawPlace(x, y, rotation, valid){
            this.super$drawPlace(x, y, rotation, valid);
            Drawf.dashCircle((x * Vars.tilesize) + this.offset, (y * Vars.tilesize) + this.offset, this.range, Pal.power);
        },
        lightingReceptor(){
            return true;
        },
        activeRange(){
            return this.range;
        }
    }, object));

    this.block.buildType = () => extend(Building, {
        heat: 0,

        offsetY(){
            return object.offsetY;
        },
        canHandleCharge(amount){
            return this.power != null && (this.power.graph.getBatteryStored() + amount * 60) / this.power.graph.getTotalBatteryCapacity() <= 1;
        },
        charge(amount){
            if(this.power){
                this.power.graph.chargeBatteries(amount * 60);
                this.heat = 1;

                if(this.power.graph.getBatteryStored() / this.power.graph.getTotalBatteryCapacity() == 1){
                    this.power.graph.all.forEach(build => {
                        if(build.block instanceof PowerBlock){
                            Call.tileDestroyed(build);
                        }
                    });
                } else if(Mathf.chanceDelta(0.2)){
                    this.damage(30);
                }
            }
        },
        updateTile(){
            this.super$updateTile();

            if(this.power){
                this.enabled = this.power.graph.batteries.size > 0;
                this.heat = Mathf.lerpDelta(this.heat, 0, 0.005);
            }
        },
        draw(){
            this.super$draw();
            Draw.z(Layer.turret + 0.001);

            this.drawSoftShadow();

            Drawf.shadow(
                object.rodRegion,
                this.x - this.offsetY() * 0.8,
                this.y - this.offsetY() * 0.8,
                object.rodRegion.width * 0.8 * Draw.scl * Draw.xscl,
                object.rodRegion.height * 1.3 * Draw.scl * Draw.yscl,
                130
            );
            
            Draw.rect(object.rodRegion, this.x, this.y + (this.offsetY() / 2), 2.5);

            if(this.heat > 0.0001){
                Draw.color(Pal.meltdownHit, this.heat);
                Draw.blend(Blending.additive);
                Draw.rect(object.heatRegion, this.x, this.y + (this.offsetY() / 2), 2.5);
                Draw.blend();
                Draw.color();
            }
        },
        drawSelect(){
            Drawf.dashCircle(this.x, this.y, this.block.activeRange(), Pal.power);
        },
        drawSoftShadow(){
            Draw.color(0, 0, 0, 0.34);
            const rad = 1.6;
            const size = object.shadowSize * Draw.scl;
            Draw.rect(object.softShadowRegion, this, size * rad * Draw.xscl, size * rad * Draw.yscl, this.rotdeg());
            Draw.color();
        }
    });
}