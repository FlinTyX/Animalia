const {refreshNearby, drawPossibleConnections} = require("blocks/production/ANIchlorophyll-panel");
const {nearby} = require("libs/ANIfunctions");

const converter =  module.exports = extend(PowerGenerator, "converter", {
    usesChemicalEnergy(){},
    lightGreen: Color.valueOf("92dd7eff"),

    load(){
        this.super$load();
        this.bottomRegion = Core.atlas.find(this.name + "-bottom");

        this.topRegion = Core.atlas.find(this.name + "-top");
        this.topRegion1 = Core.atlas.find(this.name + "-top1");
    },
    icons(){
        return [
            this.bottomRegion,
            this.region,
            this.topRegion
        ]
    },
    setStats(){
        this.super$setStats();
        this.stats.remove(Stat.basePowerGeneration);
    },
    setBars(){
        this.super$setBars();
        this.bars.add("progress", e => new Bar(
                "bar.chemicalEnergy",
                this.lightGreen, 
                () => e.productionEfficiency
            )
        );
    },
    drawPlace(x, y, rotation, valid){
        this.super$drawPlace(x, y, rotation, valid);

        if(Vars.mobile) return;
        drawPossibleConnections(x, y, this, b => 
            b.block.name != "animalia-chlorophyll-panel" ||
            b.block.name == "animalia-chlorophyll-panel" && b.connections() == 4
        );
    }
});

converter.buildType = () => extend(PowerGenerator.GeneratorBuild, converter, {
    inputs: [],

    output(){
        let a = 0;

        if(this.inputs.length > 0){
            this.inputs.forEach(i => a += i.output() / 60);
        }

        return a;
    },
    connections(){
        return Math.max(1, Math.min(this.inputs.length, 4));
    },
    updateTile(){
        this.super$updateTile();

        if(this.timer.get(0, 60)){
            refreshNearby(this, this.inputs, b => 
                b.block.name == "animalia-chlorophyll-panel"
            )
        }

        this.productionEfficiency = Mathf.approachDelta(this.productionEfficiency, Mathf.num(this.enabled && this.inputs.length > 0), 0.01);
    },
    draw(){
        Draw.rect(converter.bottomRegion, this.x, this.y);

        Draw.color(Pal.heal);
        Draw.alpha(this.productionEfficiency * 0.3);
        Fill.square(this.x, this.y, this.block.size * Vars.tilesize/2);
        
        Draw.reset();
        Draw.rect(converter.region, this.x, this.y);
        Draw.blend(Blending.additive);

        Draw.color(Pal.heal, Pal.accent, converter.lightGreen, this.productionEfficiency);
        Draw.alpha(this.productionEfficiency * 0.7);

        Draw.rect(converter.topRegion1, this.x, this.y);
        
        Draw.blend();
        Draw.reset();

        Draw.rect(converter.topRegion, this.x, this.y);
    },
    drawLight(){
        Drawf.light(this.x, this.y, 60 * (0.5 + this.productionEfficiency/2), converter.lightGreen, this.productionEfficiency * 0.85);
    },
    getPowerProduction(){
        return this.output() * this.productionEfficiency;
    }
});